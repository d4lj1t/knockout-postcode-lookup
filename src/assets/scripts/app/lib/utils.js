define(['jquery', 'breakpoints', 'modernizr', 'postbox'], function($, breakpoints, Modernizr, postbox) {

	var module = (function(my) {

		if(!my) {my = {};}

		//SlideToggle any target dom element when an initiator is clicked. Can be restricted so only executes when a media query is matched.
		my.sliderContainer = function() {

			// Do not use "touchstart" as it will prevent page from swiping.
			$('.js-slide-toggle').off().on('click', function(e) {

				var that = $(this);
				var toggleTarget = $(this).data('js-toggle');		//Dom element to be slideToggled
				var mediaQuery = $(this).data('js-toggle-mq');		//Media query to execute slideToggle if matched. Should be a property from the breakpoints obj (see app/breakpoints.js)
				var scrollTarget = $( $(this).data('js-scroll') );		//scroll to slideToggle

				//If there's a media query only execute when the media query is matched
				if (mediaQuery) {

					if ( breakpoints[mediaQuery].matches ) {
						my.doSlideToggle(toggleTarget, that, scrollTarget);
					}

				}

				//Otherwise exceute on any viewport width
				else {
					my.doSlideToggle(toggleTarget, that, scrollTarget);
				}

				setTimeout(function() {
					postbox.notifySubscribers(true, 'filter_slider_toggle');
				}, 1000);


				if ( that.is( "a" ) ) {
				    return false;
				}
			});

		};


		my.doSlideToggle = function(toggleTarget, toggleInit, scrollTarget) {

			$(toggleTarget).slideToggle('fast', function () {

				$(toggleInit).toggleClass('active');

				if ($(toggleInit).hasClass('active') && scrollTarget.length > 0 ){
					$('body').animate({ scrollTop : scrollTarget.offset().top});
				}
			});
		};

		my.tabs = function() {

			require(['tabs'], function(tabs) {
				$('.tabs').each(function() {
					new tabs(this, '.nav-tabs a[role=tab]');
				});
			});
		};

		// Internalization
		my.__ = function(text, domain) {
			return text;
		};


		/**
		 * Count characters left when entering into a text area.
		 * @param {string} textAreaID ID of text area
		 * @param {integer} maxChars Maximum number of characters allowed in textarea
		 * @return none
		 */
		my.countCharactersLeft = function(textAreaID, maxChars) {
			$('#'+textAreaID+'-feedback').html(maxChars);

			$('#'+textAreaID).keyup(function() {
				var textLength = $('#'+textAreaID).val().length;
				var textRemaining = maxChars - textLength;

				$('#'+textAreaID+'-feedback').html(textRemaining);
			});
		};


		/**
		 * Crumbtrail for xs viewports. Show and hide the crumbtail when then last crumb item is tapped.
		 * @param none
		 * @return none
		 */
		my.crumbtrailForXsViewports = function() {
			var openHeight		= $('#js-crumb-trail-container').height();	//Height of crumbtrail container when open
			var closedHeight	= 40;										//Height of crumbtrail container when closed (height of one crumbitem)


			//Init small crumbs if viewport is small on page load
			if ( breakpoints.uptoXs.matches ) {
				initSmallCrumbs();
			}


			$(window).on('resize', function() {
				//Reset the crumbs to their normal height on anyting above 480px
				if (window.innerWidth > 479) {
					resetSmallCrumbs();
				}
				else if (window.innerWidth < 480) {
					initSmallCrumbs();
				}
			});


			function resetSmallCrumbs() {
				$('#js-crumb-trail').height(closedHeight);
				$('.js-crumb-item:last-child').off();
			}


			function initSmallCrumbs() {
				openHeight = $('#js-crumb-trail-container').height();

				$('.js-crumb-item:last-child').off().on('click', function() {
					$('#js-crumb-trail').height( ($('#js-crumb-trail').height() == closedHeight) ? openHeight : closedHeight );
					$('.js-crumb-item:last-child').toggleClass('clicked');
				});
			}
		};


		/**
		 * Convert units using radio fields
		 * @param none
		 * @return none
		 */
		my.unitToggle = function() {
			var $unitTargetEle 		= $('.js-unit-toggle-val');	//Units to convert


			$('.js-unit-toggle').off('change').on('change', function(){
				var thisVal = $(this).val();	//New value of radio button
				
				switch ( thisVal ) {
					case 'cm':
						$unitTargetEle.each(function(i) {
							var oldVal = $(this).text();
							var newVal = oldVal * 2.54;
							
							newVal = Math.round(newVal);
							
							$(this).text(newVal);
						});
						break;
				
					case 'inches':
						$unitTargetEle.each(function(i) {
							var oldVal = $(this).text();
							var newVal = oldVal / 2.54;
							
							newVal = Math.round(newVal);
							
							$(this).text(newVal);
						});
						break;
				}

				
				//If there are multiple unit toggle radio buttons, change the value of all of them
				$('.js-unit-toggle').each(function(){
					$('input[value='+ thisVal +']').prop('checked',true);
				});
			});	
		};


		my.init = function() {
			this.sliderContainer();
			this.tabs();
			this.crumbtrailForXsViewports();
		};

		// Make the function global for convenience
		window.__ = my.__;

		return my;

	})(module);

	return module;
});