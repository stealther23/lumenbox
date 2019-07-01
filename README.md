# lumenbox
![version](https://img.shields.io/npm/v/lumenbox.svg?style=for-the-badge)
![npm](https://img.shields.io/npm/dt/lumenbox.svg?style=for-the-badge)

Javascript lightweight library for image overlays. No jQuery dependencies.

NOTE: Plugin is still under development, you may experience some kicks (or a lot of kicks).

## Installation
```npm i lumenbox```

## Usage
[1] Grab `lumenbox.css` and `lumenbox.min.js` from the `/dist` folder and include them in your page.

Include the css in the `<head>` of your page
```
<link href="some/path/to/lumenbox.css" rel="stylesheet">
```
And include the script right before the closing `</body>` tag
```
<script src="some/path/to/lumenbox.min.js"></script>
```

[2] Initialise Lumenbox like so:
```
<script> var Lumenbox = new Lumenbox(); </script>
```

[3] Add the `data-lumenbox` attribute to your pictures/gallery

Individual image
```
 <a href="..." data-lumenbox="example-image"><img class="example-image" src="..." alt="image-1" /></a>
```

Gallery (you have to use the same name on the data attribute)
```
<a href="..." data-lumenbox="example-image"><img class="example-gallery" src="..." alt="image-1" /></a>
<a href="..." data-lumenbox="example-image"><img class="example-gallery" src="..." alt="image-2" /></a>
<a href="..." data-lumenbox="example-image"><img class="example-gallery" src="..." alt="image-3" /></a>
```

## Options
You can configure some options from the ones available below

Upon init you need to pass the options object like so:
```
var Lumenbox = new Lumenbox({ showCounter: true });
```

|option|effect|default|status|
|---|---|---|---|
|countLabel: string|The text that appears when navigating through the gallery|'%current of %total'|<span style="color:red">development</span>
|showCounter: boolean|Show/hide the counter|false|<span style="color:red">development</span>
|infiniteNavigation: boolean|Wrap around the navigation| false|<span style="color:green">available</span>
|enableKeyboardNavigation: boolean|Use `left`/`right` arrows to navigate through the gallery|false|<span style="color:red">development</span>
|transitionDuration: number|Animation effects duration (ex. fadeIn, fadeOut)|500|<span style="color:green">available</span>
|fitInViewport: boolean|Fit all the images inside the viewport|true|<span style="color:red">development</span>

