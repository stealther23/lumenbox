(function (window, document) {
  "use strict";

  // define our non jquery animations
  var FX = {
    easing: {
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
    },
    animate: function(options) {
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
          return FX.easing.swing(progress);
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
          return FX.easing.swing(progress);
        },
        complete: options.complete,
        step: function(delta) {
          element.style.opacity = to + delta;
        }
      });
    }
  };
  window.FX = FX;

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
  };

  Lumenbox.prototype.option = function(options) {
    this.option = Object.assign(this.option, options);
  };

  Lumenbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%current/g, currentImageNum).replace(/%total/g, totalImages);
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
                   '    <div id="lumenbox-navigation>"' +
                   '      <span class="lumenbox-prev"></span>' +
                   '      <span class="lumenbox-next"></span>' +
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

    this.backDrop.addEventListener('click', function() {
      self.finish();
      return false;
    });
    this.closeButton.addEventListener('click', function() {
      self.finish();
      return false;
    });
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

    function addToAlbum(item) {
      self.gallery.push({
        alt: item.alt,
        src: item.href,
        title: item.title
      });
    }

    var dataLumenboxValue = target.getAttribute('data-lumenbox');
    var items;

    if (dataLumenboxValue) {
      items = document.querySelectorAll('[data-lumenbox="' + dataLumenboxValue + '"]');
      for (var i = 0; i < items.length; i = ++i) {
        addToAlbum({
          alt: items[i].getAttribute('alt'),
          href: items[i].getAttribute('href'),
          title: items[i].getAttribute('title') || items[i].dataset.title
        });
        if (items[i] === items[0]) {
          imageNumber = i;
        }
      }
    }

    FX.fadeIn(this.backDrop, {
      before: function () {
        self.backDrop.style.display = 'block';
      },
      duration: this.options.transitionDuration
    });
    FX.fadeIn(this.lumenbox, {
      before: function () {
        self.lumenbox.style.display = 'block';
      },
      duration: this.options.transitionDuration
    });

    this.changeImage(imageNumber);
  };

  Lumenbox.prototype.changeImage = function(imageNumber) {
    var self = this;
    var filename = this.gallery[imageNumber].src;
    var filetype = filename.split('.').slice(-1)[0];
    var img = document.getElementById('lumenbox-img');

    var preloader = new Image();
    preloader.onload = function() {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      img.setAttribute('alt', self.gallery[imageNumber].alt);
      img.setAttribute('src', filename);

      // todo
    };

    preloader.src = this.gallery[imageNumber].src;
    this.currentImageIndex = imageNumber;
  };

  Lumenbox.prototype.finish = function() {
    var self = this;

    FX.fadeOut(this.backDrop, {
      duration: this.options.transitionDuration,
      complete: function () {
        self.backDrop.style.display = 'none';
      }
    });
    FX.fadeOut(this.lumenbox, {
      duration: this.options.transitionDuration,
      complete: function () {
        self.lumenbox.style.display = 'none';
      }
    });
  };

  return new Lumenbox();
})(window, document);
