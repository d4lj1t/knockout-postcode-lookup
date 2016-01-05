define(['jquery'], function($) {

	"use strict";

	var overlay = function(options) {
		
		var settings = $.extend({
			className : '',
			onClose : $.noop,
			onOpen : $.noop
		}, options);

		var $html = $('html'),
			$body = $('body');

		var markup = '<div class="overlay ' + settings.className + '" id=""><a href="#" class="icon-close js-close"></a><div class="inner"></div></div>';
		var $overlay = $(markup),
			$inner = $overlay.find('.inner'),
			$content;

		this.content = function(content) {
			$content = $(content);
			$inner.append($content);
			return this;
		};

		this.prepare = function() {
			$overlay.hide();
			$('body').append($overlay);
			return this;
		};

		this.show = function() {

			this.prepare();

			// Save <html> css position
			var position = $html.css('position');

			$html.css({
				overflow : 'hidden',
				height : '100%',
				position : 'relative'
			});

			$overlay.fadeIn({
				duration : 200,
				complete : function() {
					settings.onOpen();
				}
			});

			$overlay.find('.js-close').on('touchstart click', function() {

				$overlay.fadeOut().promise().done(function() {
					$html.css({
						height : 'auto',
						overflow : 'auto',
						position : position
					});
					settings.onClose();
				});

				return false;
			});
		};

		this.init = function() {

		};
	};

	return overlay;
});