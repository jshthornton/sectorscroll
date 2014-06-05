(function(win, undefined) {
	'use strict';

	function _do($, _) {
		var $htmlbody = $('html, body');

		var sectorscroll = {
			_$container: $(document),
			_cache: [],
			_disabled: false,
			//_touchStart,

			init: function(opts) {
				opts = this._opts = $.extend({
					markletSelector: '.marklet',
					cache: true,
					mouse: true,
					touch: true,
					keys: true,
					scrollDuration: 500,
					axis: 'y',
					callback: $.noop
				}, opts);

				this._scrolling = false;

				this.enable();
			},

			enable: function() {
				if(this._opts.mouse === true) {
					this._$container.bind('DOMMouseScroll.sectorscroll mousewheel.sectorscroll', _.bind(this._onMouseScroll, this));
				}

				if(this._opts.touch === true) {
					this._$container.bind('touchstart.sectorscroll', _.bind(this._onTouchStart, this));
					this._$container.bind('touchmove.sectorscroll', _.bind(this._onTouchMove, this));
				}

				if(this._opts.keys === true) {
					this._$container.bind('keydown.sectorscroll', _.bind(this._onKeyDown, this));
				}

				this._disabled = false;
			},

			disable: function() {
				if(this._opts.mouse === true) {
					this._$container.unbind('DOMMouseScroll.sectorscroll mousewheel.sectorscroll', _.bind(this._onMouseScroll, this));
				}

				if(this._opts.touch === true) {
					this._$container.unbind('touchstart.sectorscroll', _.bind(this._onTouchStart, this));
					this._$container.unbind('touchmove.sectorscroll', _.bind(this._onTouchMove, this));
				}

				if(this._opts.keys === true) {
					this._$container.unbind('keydown.sectorscroll', _.bind(this._onKeyDown, this));
				}

				this._disabled = true;
			},

			refreshCache: function() {
				this._cache.length = 0;
			},

			//Events
			_move: function(direction) {
				var _this = this,
					$container = this._$container,
					scroll = $container[(this._opts.axis === 'y') ? 'scrollTop' : 'scrollLeft'](),
					closest,
					elOffset;

				function calculate(offset) {
					var distance = offset - scroll;

					if(distance > 0 && direction === -1) return;
					if(distance < 0 && direction === 1) return;
					if(distance === 0) return;

					if(closest === undefined) {
						closest = distance;
						elOffset = offset;
					} else if(Math.abs(distance) < Math.abs(closest)) {
						closest = distance;
						elOffset = offset;
					}
				};

				if(this._cache.length === 0 || this._opts.cache === false) {
					var $marklets = $(this._opts.markletSelector, $container);
					$marklets.each(function(index, el) {
						var $el = $(el),
							offset = $el.offset()[(_this._opts.axis === 'y') ? 'top' : 'left'];

						_this._cache.push(offset);

						calculate(offset);
					});
				} else {
					_.each(this._cache, function(offset) {
						calculate(offset);
					});
				}

				if(elOffset !== undefined) {
					this._scrolling = true;

					var props = {};
					props[(_this._opts.axis === 'y') ? 'scrollTop' : 'scrollLeft'] = elOffset;


					$htmlbody.animate(props, {
						duration: this._opts.scrollDuration,
						done: _.once(function() {
							_this._scrolling = false;

							if(typeof _this._opts.callback === 'function') {
								_this._opts.callback();
							}
						})
					});
				}
			},

			_extractMouseDelta: function(e) {
				if (e.wheelDelta) {
					return e.wheelDelta;
				}

				if (e.originalEvent.detail) {
					return e.originalEvent.detail * -40;
				}

				if (e.originalEvent && e.originalEvent.wheelDelta) {
					return e.originalEvent.wheelDelta;
				}
			},

			_onMouseScroll: function(e) {
				e.preventDefault();
				if(this._scrolling === true) return;

				var delta = this._extractMouseDelta(e),
					direction = (delta > 0) ? -1 : 1;

				this._move(direction);
			},

			_onTouchStart: function(e) {
				this._touchStart = e.originalEvent.touches[0][(this._opts.axis === 'y') ? 'pageY' : 'pageX'];
			},

			_onTouchMove: function(e) {
				e.preventDefault();
				if(this._scrolling === true) return;

				var delta = this._touchStart - e.originalEvent.touches[0][(this._opts.axis === 'y') ? 'pageY' : 'pageX'],
					direction = (delta < 0) ? -1 : 1;

				this._move(direction);
			},

			_onKeyDown: function(e) {
				if(this._scrolling === true) return;

				var keys = [37, 38, 39, 40],
					keyCode = e.keyCode;

				 for (var i = keys.length; i--;) {
					if (keyCode === keys[i]) {
						e.preventDefault();

						var direction = (keyCode === keys[0] || keyCode === keys[1]) ? -1 : 1;

						this._move(direction);
					}
				}
			}
		};

		return sectorscroll;
	}

	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'underscore'], _do);
	} else {
		win.sectorscroll = _do(jQuery, _);
	}
}(window));