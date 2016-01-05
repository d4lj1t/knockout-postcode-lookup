/**
 * Megamenu component
 * Description: Turn the megamenu into an off-canvas carousel menu
 */
define(['jquery', 'breakpoints', 'offcanvas', 'progress'], function($, breakpoints, Offcanvas, progress) {
	
	"use strict";

	var module = (function() {

		var my = {};

		var levels = $('.levels');
		var cr = $('body');

		var offcanvas;

		$('.js-show-next-level').on('click', function() {

			// Do not execute if not on correct view
			if(breakpoints.update.uptoMd().matches === false) {
				return false;
			}

			var state = levels.data('state') || 1;

			if(state > 2) {
				return false;
			}

			$('.level-' + (state+1)).eq(0).addClass('level-show');

			levels.css('transform', 'translate3d(-' + (state * offcanvas.getContentWidth()) + 'px, 0, 0)');
			levels.data('state', ++state);

			return false;

		});

		// Use only click but not touchstart as it will prevent scrolling
		$('.js-show-next-level-children').children().on('click', function() {

			// Do not execute if not on correct view
			if(breakpoints.update.uptoMd().matches === false) {
				return false;
			}

			$('.js-show-next-level-children').children().removeClass('active');
			$(this).addClass('active').find('.level').addClass('level-show');

			var state = levels.data('state') || 1;
			
			if(state > 2) {
				return false;
			}

			levels.css('transform', 'translate3d(-' + (state * offcanvas.getContentWidth() ) + 'px, 0, 0)');
			levels.data('state', ++state);

		});

		// This can stay touchstart as it is on the top of the UI and can't be used for scrolling
		$('a.js-show-prev-level').on('click', function() {

			var state = levels.data('state');
			var openedLevel = $('.level-' + state);

			levels.data('state', --state);

			levels.css('transform', 'translate3d(-' + ((state-1) * offcanvas.getContentWidth()) + 'px, 0, 0)').on('transitionend', function() {
				openedLevel.removeClass('level-show');
				levels.off('transitionend');
			});

			return false;

		});

		my.bindEvents = function() {

			$('.js-open-off-site-nav, .js-show-prev-level .js-icon-close').on('click', function() {
				offcanvas.toggle();
				return false;
			});

			breakpoints.md.addListener(function(query) {
				if(query.matches) {
					offcanvas.close();
				}
			});
		};

		my.init = function() {

			offcanvas = new Offcanvas({
				position : 'left',
				container : $('.container-responsive'),
				scroll : false,
				onAfterClose : function() {
					levels.css('transform', 'translate3d(0, 0, 0)'); // Remove the offset
					levels.data('state', 1); // Reset state
				}
			});

			offcanvas.setContent($('.responsive-nav'));
			offcanvas.toggle();

			progress.done();

			my.bindEvents();
		};

		return my;

	})();

	return module;

});