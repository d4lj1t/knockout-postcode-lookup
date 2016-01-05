/**
 * Plugin to keep elements in columns and toggle them if they are too much
 */
(function(factory) {
	if(typeof define == 'function' && define.amd) {
		define(['jquery', 'swatches_toggle'], factory);
	} else {
		factory(jQuery);
	}
})(function($, swatches_toggle) {
	$.fn.swatches = function(options) {

		"use strict";
		
		var settings = $.extend({

		}, options);

		var Swatches = function(container, settings) {

			var swatchesToggle = null;

			var self = this;

			var humanClick = false;

			var toggled = false;

			// Handles resizing event
			this.onResize = function() {

				swatchesToggle.setToggleBtnTextAuto();
				
				if(swatchesToggle.mustDisplay() === false) {
			 		$(container).height('');
				}

				swatchesToggle.displayAuto();
			};

			this.toggle = function() {

				// Determine if the event is fired by a human
				humanClick = true;

				var start_height, height, speed = 250, _class = 'restrain';

				if(swatchesToggle.toggleBtnClicked() === false) {

					swatchesToggle.toggleBtnClicked(true);

					start_height = $(container).height();
					height = $(container).addClass(_class).height();
					$(container).height(start_height).animate({
						height : height
					}, speed);

					swatchesToggle.setToggleBtnText( swatchesToggle.getToggleBtnTextStringOpened() );

					if(settings.afterOpening) {
						settings.afterOpening.call(this);
					}

				} else {
					swatchesToggle.toggleBtnClicked(false);

					start_height = $(container).height();
					height = $(container).height('').removeClass(_class).height();
					$(container).addClass(_class).height(start_height).animate({
						height : height
					}, speed, function() {
						$(this).removeClass(_class).height('');
					});

					swatchesToggle.setToggleBtnText( swatchesToggle.getToggleBtnTextStringClosed() );

					// Invoke callback after 
					if(settings.afterClosing) {
						settings.afterClosing.call(this);
					}
				}

				humanClick = false;

				return false;
			};

			this.bindEvents = function() {
				$(window).resize(function() {
					self.onResize.call(self);
				});

				this.toggleBtn.on('touchstart click', function() {
					return self.toggle.call(self);
				});
			};

			this.prepareElements = function() {

				// Button that will trigger toggling
				this.toggleBtn = $(swatchesToggle.toggleBtn);
			};

			this.init = function() {

				swatchesToggle = new SwatchesToggle(container);

				this.prepareElements();
				this.bindEvents();
			};

			this.init();
		};

		this.each(function() {

			new Swatches(this, settings);
		});

		return this;
	};
});