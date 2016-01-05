/**
 * Google Tag Manager
 */
define([], function() {
	"use strict";

	// Global data layer
	window.dataLayer = window.dataLayer || [];

	// Local copy for convenience
	var dataLayer = window.dataLayer;

	var GTM = {};

	GTM.page = function(obj) {
		dataLayer.push({
			"page" : {
				"identifier" : "production",
				"http_response_code" : obj.http_response_code || 200,
				"name" : obj.name,
				"virtual" : ""
			}
		});
	};

	return GTM;
});