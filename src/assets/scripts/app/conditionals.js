//Content Modules (homepage)
try {
	if ( document.getElementsByClassName('js-isotope-container').length > 0 ) {
		require(['jquery', 'isotope'], function($, Isotope) {
			require( [ 'jquery-bridget/jquery.bridget' ],
			function(){
				$.bridget( 'isotope', Isotope );

				var $container = $('.js-isotope-container');
				
				$container.isotope({
					itemSelector: '.cm',
					layoutMode: 'masonry',
					masonry: {
						columnWidth: '.cm-grid-sizer',
						isResizeBound : true
					}
				});

			});
		});
	}
} catch (e) {
	console.log(e);
}

/**
 * PDP
 */
try {
	if( document.getElementsByClassName('js-pagetype-pdp').length > 0 ) {
		require(['pdp'], function() {
			
		});
	}
} catch(e) {
	console.log(e);
}


/**
 * PLP
 */
try {
	if ( document.getElementsByClassName('js-pagetype-plp').length > 0 ) {		
		require(['plp'], function(plp) {
			plp.init();
		});
	}
} catch(e) {
	console.log(e);
}

/**
 * Itinerary
 * Checkout floating basket (right col)
 */
try {
	if ( document.getElementsByClassName('js-itinerary').length > 0 ) {
		require(['basket'], function(basket) {
			basket.init();
		});
	}
} catch(e) {
	console.log(e);
}


/**
 * Form Validation
 */
try {
	if ( document.getElementsByClassName('js-pagetype-jquery-validate').length > 0 ) {
		require(['form_validate'], function(form_validate) {
			form_validate.init();
		});
	}
} catch(e) {
	console.log(e);
}

/**
 * Edit Payments
 */
 try {
	if ( document.getElementsByClassName('js-pagetype-edit-payments').length > 0 ) {
		require(['edit_payments'], function(edit_payment) {
			edit_payment.init();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Contact Us
 */
try {

	if ( document.getElementsByClassName('js-pagetype-contact-us').length > 0 ) {
		require(['contact_us'], function(contactUs) {
			contactUs.init();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Contact Us
 */
try {

	if ( document.getElementsByClassName('js-pagetype-postcode-lookup').length > 0 ) {
		require(['postcode_lookup'], function(postcodeLookup) {
			postcodeLookup.init();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Back To Top
 */
try {

	if ( document.getElementsByClassName('js-pagetype-back-to-top').length > 0 ) {
		require(['back_to_top'], function(backToTop) {
			backToTop.init();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Current Offers Hover
 */
try {

	if ( document.getElementsByClassName('js-pagetype-current-offers').length > 0 ) {
		require(['current_offers'], function(currentOffers) {
			currentOffers.init();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Gift Message character count
 */
try {

	if ( document.getElementById('js-gift-text-area') ) {
		require(['utils'], function(utils) {
			utils.countCharactersLeft('js-gift-text-area', 240);
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Unit Toggle
 */
try {

	if ( document.getElementsByClassName('js-unit-toggle') ) {
		require(['utils'], function(utils) {
			utils.unitToggle();
		});
	}

} catch(e) {
	console.log(e);
}

/**
 * Responsive tables
 */
try {
	if( document.getElementsByClassName('js-zurb-responsive').length > 0 ) {
		require(['zurbresponsivetables'], function() {
			
		});
	}
} catch(e) {
	console.log(e);
}
