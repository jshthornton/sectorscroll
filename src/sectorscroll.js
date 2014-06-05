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
					pageKeys: false,
					scrollDuration: 500,
					axis: 'y',
					callback: $.noop
				}, opts);

				this._scrolling = false;

				this.enable();
			},

			enable: function() {
				if(this._opts.mouse === true) {
					this._$container.bind('DOMMouseScroll.sectorscroll mousewheel.sectorscroll', $.proxy(this._onMouseScroll, this));
				}

				if(this._opts.touch === true) {
					this._$container.bind('touchstart.sectorscroll', $.proxy(this._onTouchStart, this));
					this._$container.bind('touchmove.sectorscroll', $.proxy(this._onTouchMove, this));
				}

				if(this._opts.keys === true) {
					this._$container.bind('keydown.sectorscroll', $.proxy(this._onKeyDown, this));
				}

				this._disabled = false;
			},

			disable: function() {
				if(this._opts.mouse === true) {
					this._$container.unbind('DOMMouseScroll.sectorscroll mousewheel.sectorscroll', $.proxy(this._onMouseScroll, this));
				}

				if(this._opts.touch === true) {
					this._$container.unbind('touchstart.sectorscroll', $.proxy(this._onTouchStart, this));
					this._$container.unbind('touchmove.sectorscroll', $.proxy(this._onTouchMove, this));
				}

				if(this._opts.keys === true) {
					this._$container.unbind('keydown.sectorscroll', $.proxy(this._onKeyDown, this));
				}

				this._disabled = true;
			},

			refreshCache: function() {
				this._cache.length = 0;
			},

			_getPropName: function(type) {
				if(type === 'scroll') {
					return (this._opts.axis === 'y') ? 'scrollTop' : 'scrollLeft';
				} else if(type === 'page') {
					return (this._opts.axis === 'y') ? 'pageY' : 'pageX';
				} else if(type === 'position') {
					return (this._opts.axis === 'y') ? 'top' : 'left';
				}
			},

			//Events
			_move: function(direction) {
				var _this = this,
					$container = this._$container,
					scroll = $container[this._getPropName('scroll')](),
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
							offset = $el.offset()[_this._getPropName('position')];

						_this._cache.push(offset);

						calculate(offset);
					});
				} else {
					$.each(this._cache, function(index, offset) {
						calculate(offset);
					});
				}

				if(elOffset !== undefined) {
					this._scrolling = true;

					var props = {};
					props[_this._getPropName('scroll')] = elOffset;

					var done = false;
					$htmlbody.animate(props, {
						duration: this._opts.scrollDuration,
						done: function() {
							if(done) return;

							_this._scrolling = false;

							if(typeof _this._opts.callback === 'function') {
								_this._opts.callback();
							}

							done = true;
						}
					});

					return true;
				}

				return false;
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
				if(this._scrolling === true) {
					e.preventDefault();
					return;
				}

				var delta = this._extractMouseDelta(e),
					direction = (delta > 0) ? -1 : 1;

				if(this._move(direction)) {
					e.preventDefault();
				}
			},

			_onTouchStart: function(e) {
				this._touchStart = e.originalEvent.touches[0][this._getPropName('page')];
			},

			_onTouchMove: function(e) {
				if(this._scrolling === true) {
					e.preventDefault();
					return;
				}

				var delta = this._touchStart - e.originalEvent.touches[0][this._getPropName('page')],
					direction = (delta < 0) ? -1 : 1;

				if(this._move(direction)) {
					e.preventDefault();
				}
			},

			_onKeyDown: function(e) {
				if(this._scrolling === true) return;

				// Page Up, Left, Up
				// Page Down, Right, Down
				var keys = [
					33, 37, 38,
					34, 39, 40
				],
					keyCode = e.keyCode;

				 for (var i = keys.length; i >= 0; i--) {

					if (keyCode === keys[i]) {
				 		if(this._opts.pageKeys === false && (keyCode === keys[0] || keyCode === keys[3])) {
				 			continue;
				 		}

						var direction = (keyCode === keys[0] || keyCode === keys[1] || keyCode === keys[2]) ? -1 : 1;
						if(this._move(direction)) {
							e.preventDefault();
						}
					}
				}
			}
		};

		return sectorscroll;
	}

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], _do);
	} else {
		win.sectorscroll = _do(jQuery);
	}
}(window));