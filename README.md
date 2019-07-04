# lumenbox
[![version](https://img.shields.io/npm/v/lumenbox.svg?style=for-the-badge)](https://www.npmjs.com/package/lumenbox)
[![npm](https://img.shields.io/npm/dt/lumenbox.svg?style=for-the-badge)](https://www.npmjs.com/package/lumenbox)
[![license](https://img.shields.io/github/license/stealther23/lumenbox.svg?style=for-the-badge)](/LICENSE)

Javascript lightweight library for image overlays, no dependencies.

## Installation
```npm i lumenbox```

## Usage
[1] Grab `lumenbox.min.css` and `lumenbox.min.js` from the `/dist` folder and include them in your page.

Include the css in the `<head>` of your page
```
<link href="some/path/to/lumenbox.min.css" rel="stylesheet">
```
And include the script right before the closing `</body>` tag
```
<script src="some/path/to/lumenbox.min.js"></script>
```

[2] Initialize Lumenbox like so:
```
<script> var Lumenbox = new Lumenbox(); </script>
```

[3] Add the `data-lumenbox` attribute to your pictures/gallery

Individual image
```
 <a href="..." data-lumenbox="example-image"><img src="..." alt="image-1" /></a>
```

Gallery (you have to use the same name on the data attribute)
```
<a href="..." data-lumenbox="example-image"><img src="..." alt="image-1" /></a>
<a href="..." data-lumenbox="example-image"><img src="..." alt="image-2" /></a>
<a href="..." data-lumenbox="example-image"><img src="..." alt="image-3" /></a>
```

## Options
You can configure some options from the ones available below

Upon init you need to pass the options object like so:
```
var Lumenbox = new Lumenbox({ showCounter: true });
```

|option|effect|default|
|---|---|---|
|countLabel: string|The text that appears when navigating through the gallery|'%current of %total'
|showCounter: boolean|Show/hide the counter|false
|infiniteNavigation: boolean|Wrap around the navigation|false
|enableKeyboardNavigation: boolean|Use `left`/`right` arrows to navigate through the gallery|false
|transitionDuration: number|Animation effects duration (ex. fadeIn, fadeOut)|500
|fitInViewport: boolean|Fit all the images inside the viewport|true
|backDropClose: boolean|Close gallery when clicking overlay|true

