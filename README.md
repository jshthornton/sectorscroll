sectorscroll
===============

sectorscroll (sector scroll) is a small Javascript utility which aids developers who want to have a website which scrolls in segments (sectors). This script will automatically setup the events, point caching, and animations.

Demo: http://codepen.io/Jshthornton/pen/IaiCm

## Dependencies
* jQuery 1.4+ (Tested with 2.1.1 & 1.10.1)

## Usage
sectorscroll supports both AMD and non-AMD environments. When using AMD sectorscroll does not pollute the window object.

To get up and running all you need to do is import the script (either with AMD or adding the script tag), then initialise the instance (see below).
```
<script src="/js/sectorscroll.js"></script>
```

```
;(function() {
	sectorscroll.init();
}());
```

The `init` methods take 1 parameter which is an object of settings / options. Here is the list of defaults to help:
```
{
	markletSelector: '.marklet', // The element class to use to find elements to scroll to
	cache: true, // Whether to use caching (more below)
	mouse: true, // Work with mouse scrolls
	touch: true, // Work with touch scrolls
	keys: true, // Work with key scrolls (left, up, right, down)
	pageKeys: false, // Work with page key scrolls (page up, page down)
	scrollDuration: 500, // How long the scroll takes
	axis: 'y', // Scroll axis x || y
	callback: $.noop // The callback function to invoke once the scroll has finished
}
```

### Marklet
The marklet elements are what the script scrolls to. The script will find the next or previous (depending on scroll direciton) marklet element and scroll to that. If no marklet is found the user is free to manually scroll.

### Caching
By default this script could be quite intensive due to having to find all of the marklets on the page, then looping over them, then finding their offsets. To overcome this as much as possible caching is implemented.

After the user has scrolled once all of the marklet element's offsets are stored in a cache which is the looped over instead of finding marklets, then looping, then finding their offsets.

This as you can imagine might cause issues for you if you add more marklets to the page or if you know that certain elements dimensions will change. To overcome you can do one of two things: Disable caching, or use the method `sectorscroll.refreshCache()` - This will reset the cache for that the marklets are rescanned and re-evaluated.

### Enabling / Disabling
You might not want sectorscroll to be on all of the time. Thus you have the ability to disable and enable its functionally via `sectorscroll.disable()` and `sectorscroll.enable()`.

**Note:** sectorscroll is not enabled until `init` is invoked for the first time.

## Browser Support (Tested in)
* Chrome v35
* Firefox v29
* Opera v21
* IE v11, v10, v9, v8, v7
