/**
 * My account
 */
define(['jquery', 'breakpoints', 'progress'], function($, breakpoints, progress) {

	"use strict";
	
	var module = (function() {

		var my = {};

		var component = $('.js-my-account');
		var js_trigger = $('.js-open-my-account');

		my.toggle = function() {

			// Don't toggle on desktop
			if(breakpoints.md.matches) {
				$(js_trigger).find('.menu').removeClass('hover');
				return false;
			}
		};

		my.bindEvents = function() {

			$('.js-my-account .js-close').on('touchstart click', function() {
				$(document).trigger('touchstart');
				return false;
			});
		};

		my.init = function() {

			my.bindEvents();
			my.toggle();

			progress.done();

			js_trigger.hovertouch(function(e) {
				if($(this).hasClass('hover')) {
					var $target = $(e.target);
					// Remove hover state on certain conditions
					if($target.is(js_trigger) || $target.hasClass('icon-account-default')) {
						$(this).hovertouch('remove');
						return false;
					}
				}
			}).trigger('touchstart');
		};

		return my;

	})();

	return module;
});