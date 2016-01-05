/**
 * Define various breakpoints required for the website.
 * !important: Please make sure that any new breakpoints added in here should be also added to the "assets/styles/bootstrap/less/variables.less"
 */
define(['matchmedia_listener'], function() {
	"use strict";

	var breakpointsStore = {
		lg : '(min-width: 1200px)', // Large desktop and up
		md : '(min-width: 992px)',	// Standard desktop and up
		sm : '(min-width: 768px)',	// Tablet potrait and up
		xs : '(min-width: 480px)',	// Smartphones
		uptoXs : '(max-width: 479px)',	// Up to Smartphones
		uptoSm : '(max-width: 767px)',	// Up to tablet portrait
		uptoMd : '(max-width: 991px)'	// Up to desktop
	};

	var breakpoints = {};
	breakpoints.update = {};

	function handler(breakpoint) {
		return function() {
			return window.matchMedia(breakpoint);
		};
	}

	for(var bp in breakpointsStore) {
		breakpoints[bp] = window.matchMedia(breakpointsStore[bp]);
		breakpoints.update[bp] = handler(breakpointsStore[bp]);
	}

	// Method to bind a listener and execute its callback
	breakpoints.dispatch = function(bp, callback) {
		breakpoints[bp].addListener(callback);
		if(breakpoints[bp].matches) {
			callback(breakpoints[bp]);
		}
	};

	return breakpoints;
});