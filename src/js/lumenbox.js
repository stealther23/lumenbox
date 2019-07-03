(function (window, document) {
  "use strict";

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Lumenbox;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Lumenbox;
      });
    }
    else {
      window.Lumenbox = Lumenbox;
    }
  }

  Lumenbox.easing = {
    linear: function(progress) {
      return progress;
    },
    quadratic: function(progress) {
      return Math.pow(progress, 2);
    },
    swing: function(progress) {
      return 0.5 - Math.cos(progress * Math.PI) / 2;
    },
    circ: function(progress) {
      return 1 - Math.sin(Math.acos(progress));
    },
    back: function(progress, x) {
      return Math.pow(progress, 2) * ((x + 1) * progress - x);
    },
    bounce: function(progress) {
      for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
        }
      }
    },
    elastic: function(progress, x) {
      return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
    }
  };

  Lumenbox.prototype.effects = {
    animate: function (options) {
      var start = new Date;
      if (options.before) {
        options.before();
      }
      var id = setInterval(function() {
        var timePassed = new Date - start;
        var progress = timePassed / options.duration;
        if (progress > 1) {
          progress = 1;
        }
        options.progress = progress;
        var delta = options.delta(progress);
        options.step(delta);
        if (progress === 1) {
          clearInterval(id);
          if (options.complete) {
            options.complete();
          }
        }
      }, options.delay || 10);
    },
    fadeOut: function(element, options) {
      var to = 1;
      this.animate({
        before: options.before,
        duration: options.duration,
        delta: function(progress) {
          progress = this.progress;
          return Lumenbox.easing.swing(progress);
        },
        complete: options.complete,
        step: function(delta) {
          element.style.opacity = to - delta;
        }
      });
    },
    fadeIn: function(element, options) {
      var to = 0;
      this.animate({
        before: options.before,
        duration: options.duration,
        delta: function(progress) {
          progress = this.progress;
          return Lumenbox.easing.swing(progress);
        },
        complete: options.complete,
        step: function(delta) {
          element.style.opacity = to + delta;
        }
      });
    }
  };

  function Lumenbox(options) {
    this.gallery = [];
    this.currentImageIndex = void 0;
    this.init();

    // options
    this.options = Object.assign({}, this.constructor.defaults);
    this.option(options);
  }

  Lumenbox.defaults = {
    countLabel: '%current of %total',
    fitInViewport: true,
    showCounter: false,
    infiniteNavigation: false,
    enableKeyboardNavigation: false,
    transitionDuration: 500,
    backDropClose: true,
  };

  Lumenbox.prototype.option = function(options) {
    this.options = Object.assign(this.options, options);
  };

  Lumenbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.countLabel.replace(/%current/g, currentImageNum).replace(/%total/g, totalImages);
  };

  Lumenbox.prototype.init = function() {
    var self = this;
    // Both enable and build methods require the body tag to be in the DOM.
    document.addEventListener('DOMContentLoaded', function() {
      self.enable();
      self.build();
    }, false);
  };

  Lumenbox.prototype.build = function () {
    if (document.getElementById('lumenbox')) {
      return;
    }
    var self = this;

    var template = '<div id="lumenbox-overlay" class="lumenbox-overlay"></div>' +
                   '<div id="lumenbox" class="lumenbox">' +
                   '	<div class="lumenbox-container">' +
                   '    <img src="" alt="" id="lumenbox-img"/>' +
                   '    <div id="lumenbox-navigation">' +
                   '      <span class="lumenbox-control lumenbox-prev" id="lumenbox-prev"></span>' +
                   '      <span class="lumenbox-control lumenbox-next" id="lumenbox-next"></span>' +
                   '    </div>' +
                   '  </div>' +
                   '	<div id="lumenbox-close">' +
                   '		<span>×</span>' +
                   '	</div>' +
                   '</div>';

    // Add it to the body on init
    document.body.insertAdjacentHTML('beforeEnd', template);

    this.backDrop = document.getElementById('lumenbox-overlay');
    this.lumenbox = document.getElementById('lumenbox');
    this.closeButton = document.getElementById('lumenbox-close');
    this.prevButton = document.getElementById('lumenbox-prev');
    this.nextButton = document.getElementById('lumenbox-next');

    // event listeners
    if (this.options.backDropClose) {
      this.backDrop.addEventListener('click', function() {
        self.finish();
        return false;
      });
    }
    this.closeButton.addEventListener('click', function() {
      self.finish();
      return false;
    });
    this.prevButton.addEventListener('click', function () {
      self.currentImageIndex === 0
        ? self.changeImage(self.gallery.length - 1)
        : self.changeImage(self.currentImageIndex - 1);
    });
    this.nextButton.addEventListener('click', function () {
      self.currentImageIndex === self.gallery.length - 1
        ? self.changeImage(0)
        : self.changeImage(self.currentImageIndex + 1);
    });

    window.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        self.finish();
        return false;
      }

      if (self.options.enableKeyboardNavigation) {
        // using keyCode for IE compatibility
        if (e.key === 'ArrowRight' || e.keyCode === 39) {
          if (self.options.infiniteNavigation) {
            self.currentImageIndex === self.gallery.length - 1
                ? self.changeImage(0)
                : self.changeImage(self.currentImageIndex + 1);
          } else if (self.currentImageIndex !== self.gallery.length - 1) {
            self.changeImage(self.currentImageIndex + 1);
          }
          return false;
        }

        if (e.key === 'ArrowLeft' || e.keyCode === 37) {
          if (self.options.infiniteNavigation) {
            !self.currentImageIndex
                ? self.changeImage(self.gallery.length - 1)
                : self.changeImage(self.currentImageIndex - 1);
          } else if (!!self.currentImageIndex) {
            self.changeImage(self.currentImageIndex - 1);
          }
          return false;
        }
      }
    });

    if (this.options.fitInViewport) {
      window.addEventListener('resize', self.resize);
    }
  };

  Lumenbox.prototype.enable = function() {
    var self = this;
    var elementsArray = document.querySelectorAll('a[rel^=lumenbox], area[rel^=lumenbox], a[data-lumenbox], area[data-lumenbox]');

    elementsArray.forEach(function(elem) {
      elem.addEventListener("click", function() {
        event.preventDefault();
        self.start(event.currentTarget);
        return false;
      });
    });
  };

  Lumenbox.prototype.start = function(target) {
    var self = this;

    this.gallery = [];
    var imageNumber = 0;

    function addToGallery(item) {
      self.gallery.push({
        alt: item.alt,
        src: item.src,
        title: item.title
      });
    }

    var dataLumenboxValue = target.getAttribute('data-lumenbox');
    var items;

    if (dataLumenboxValue) {
      items = document.querySelectorAll('[data-lumenbox="' + dataLumenboxValue + '"]');
      for (var i = 0; i < items.length; i = ++i) {
        addToGallery({
          alt: items[i].getAttribute('alt'),
          src: items[i].getAttribute('href'),
          title: items[i].getAttribute('title') || items[i].dataset.title
        });
        if (items[i] === target) {
          imageNumber = i;
        }
      }
    }

    this.effects.fadeIn(this.backDrop, {
      before: function () {
        self.backDrop.style.display = 'block';
      },
      duration: this.options.transitionDuration
    });
    this.effects.fadeIn(this.lumenbox, {
      before: function () {
        self.lumenbox.style.display = 'block';
      },
      duration: this.options.transitionDuration
    });

    this.changeImage(imageNumber);
  };

  Lumenbox.prototype.resize = function() {
    var imageHeight;
    var imageWidth;
    var maxImageHeight;
    var maxImageWidth;
    var wh;
    var ww;

    var img = document.getElementById('lumenbox-img');

    ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    // take the controls sizes into account and a
    maxImageWidth = ww - 130 - 40; // 65px * 2 for the controls + 20 * 2 for each sides spacing
    maxImageHeight = wh - 55 - 40;

    if ((img.width / maxImageWidth) > (img.height / maxImageHeight)) {
      imageWidth  = maxImageWidth;
      imageHeight = parseInt(img.height / (img.width / imageWidth), 10);
      img.width = imageWidth;
      img.height = imageHeight;
    } else {
      imageHeight = maxImageHeight;
      imageWidth = parseInt(img.width / (img.height / imageHeight), 10);
      img.width = imageWidth;
      img.height = imageHeight;
    }
  };

  Lumenbox.prototype.changeImage = function(imageNumber) {
    var self = this;
    var filename = this.gallery[imageNumber].src;
    var filetype = filename.split('.').slice(-1)[0];
    var img = document.getElementById('lumenbox-img');

    var preloader = new Image();
    preloader.onload = function() {
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var wh;
      var ww;

      img.setAttribute('alt', self.gallery[imageNumber].alt);
      img.setAttribute('src', filename);

      if (self.options.fitInViewport) {
        ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

        // take the controls sizes into account and a
        maxImageWidth = ww - 130 - 40; // 65px * 2 for the controls + 20 * 2 for each sides spacing
        maxImageHeight = wh - 55 - 40;

        if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
          if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
            imageWidth  = maxImageWidth;
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
            img.width = imageWidth;
            img.height = imageHeight;
          } else {
            imageHeight = maxImageHeight;
            imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
            img.width = imageWidth;
            img.height = imageHeight;
          }
        }
      }
    };

    preloader.src = this.gallery[imageNumber].src;
    this.currentImageIndex = imageNumber;
    this.updateNavigation();
  };

  Lumenbox.prototype.updateNavigation = function() {
    this.prevButton.style.display = 'none';
    this.nextButton.style.display = 'none';

    if (this.gallery.length > 1) {
      if (this.options.infiniteNavigation) {
        this.prevButton.style.display = 'block';
        this.nextButton.style.display = 'block';
      } else {
        if (this.currentImageIndex > 0) {
          this.prevButton.style.display = 'block';
        }
        if (this.currentImageIndex < this.gallery.length - 1) {
          this.nextButton.style.display = 'block';
        }
      }
    }
  };

  Lumenbox.prototype.finish = function() {
    var self = this;

    this.effects.fadeOut(this.backDrop, {
      duration: this.options.transitionDuration,
      complete: function () {
        self.backDrop.style.display = 'none';
      }
    });
    this.effects.fadeOut(this.lumenbox, {
      duration: this.options.transitionDuration,
      complete: function () {
        self.lumenbox.style.display = 'none';
      }
    });
  };

})(window, document);
