/**
 * Product module
 *
 * Handles all changes in the product
 */
define(['jquery', 'postbox', 'ko'], function($, postbox, ko) {

	"use strict";

	var instance;

	var Product = function(data) {

		this.data = data;

		this.init();
	};

	// Check if all necessary variations for the product purchase are selected.
	Product.prototype.ok = function() {
		return true;
	};

	Product.prototype.setTempSelected = function() {

	};

	Product.prototype.removeTempSelected = function() {
		
	};

	Product.prototype.swatchClick = function(model, event) {

		var swatch = $(event.target).hasClass('swatch') ? $(event.target) : $(event.target).parents('.swatch').eq(0);

		// Swatch is marked as unavailable.
		if( swatch.hasClass('unavailable') ) {
			postbox.notifySubscribers(swatch, 'swatch_unavailable');
			return false;
		}

		var variation = swatch.data('variation'),
			value = swatch.data('value');

		if(variation === undefined || variation === '') {
			throw 'No variation type provided.';
		}

		if(value === undefined || value === '') {
			throw 'No variation value provided';
		}

		if(typeof this[variation] != 'function') {
			this[variation] = ko.observable();
		}

		this[variation](value);

		postbox.notifySubscribers(swatch, 'swatch_selected');
	};

	// Extend KnockoutJS default functionality
	Product.prototype.bindingHandlers = function() {
		ko.bindingHandlers.currency = {
		    symbol: ko.observable('&pound;'),
		    update: function(element, valueAccessor, allBindingsAccessor){
		        return ko.bindingHandlers.html.update(element,function(){
		            var value = +(ko.utils.unwrapObservable(valueAccessor()) || 0),
		                symbol = ko.utils.unwrapObservable(allBindingsAccessor().symbol === undefined ? allBindingsAccessor().symbol : ko.bindingHandlers.currency.symbol);
		            return symbol + value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
		        });
		    }
		};
	};

	Product.prototype.init = function() {

		this.bindingHandlers();

		for(var d in this.data) {
			this[d] = ko.observable(this.data[d]);
		}

		// Some products have variations
		this.variations = ko.observableArray([]);
	};

	return {
		getInstance : function(data) {
			if(!instance) {
				instance = new Product(data);
			}

			return instance;
		}
	};
});