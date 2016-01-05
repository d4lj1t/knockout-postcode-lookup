define(['jquery', 'breakpoints', 'offcanvas', 'progress'], function($, breakpoints, Offcanvas, progress) {
	
	"use strict";

	var module = (function() {

		var my = {};

		var close_btn = null;

		var offcanvas = null;

		my.bindEvents = function() {

			close_btn.on('click.sm', function() {
				if(breakpoints.update.uptoMd().matches) {
					offcanvas.close();
					return false;
				}
			});

			$('.js-open-off-canvas-minicart').on('click', function() {
				if(breakpoints.update.uptoMd().matches) {
					offcanvas.toggle();
				}
			});

			// Hide component
			breakpoints.md.addListener(function(query) {
				if(query.matches) {
					offcanvas.close();
				}
			});
		};

		my.init = function() {

			close_btn = $('.mini-cart .js-icon-close');

			offcanvas = new Offcanvas({
				container : $('.container-responsive'),
				scroll : false
			});
			offcanvas.setContent($('.mini-cart'));
			offcanvas.open();

			progress.done();

			my.bindEvents();
		};

		return my;

	}());

	return module;

});