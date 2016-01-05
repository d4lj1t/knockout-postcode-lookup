define(['jquery', 'nouislider', 'breakpoints', 'iscroll', 'postbox', 'cookie'], function($, nouislider, breakpoints, IScroll, postbox, cookie) {

	var module = (function(my) {

		if(!my) {my = {};}


		/**
		* Show and hide the PLP filter col when js-filter-toggle is clicked
		* @param none 
		* @return none
		*/
		my.showHideFilters = function() {
			
			var offcanvas = null;

			$('.js-filter-toggle').click(function(){
				var txt = $('.js-plp-container').hasClass('closed') ? __('Hide') : __('Show');
				
				if(breakpoints.sm.matches) {
					$('.js-plp-container').toggleClass('closed');
					$('small', this).text(txt);
					
					
					//Set session cookie to remeber filter col state. Will be read server-side to then apply 'closed' class on .js-plp-container as approiate.
					$.cookie('hof_plp_filter_col', (txt == __('Hide')) ? __('Show') : __('Hide'));
					return false;
				}

				require(['offcanvas'], function(Offcanvas) {
					if(!offcanvas) {
						offcanvas = new Offcanvas({
							position : 'right',
							container : $('.container-responsive'),
							scroll : false,
							floating: true,
							closeControl: true
						});

						offcanvas.setContent($('.plp-sidebar'));
					}
					offcanvas.toggle();
				});

				return false;
			});


			//Change label on small view ports where off-canvas is used
			if ( breakpoints.uptoSm.matches ) {
				$('.js-filter-toggle small').text( __('Show') );
			}
			
			
			//Reset the show/hide label when viewport is resized
			window.addEventListener('resize', function() {
				//Reset the crumbs to their normal height on anyting above 480px
				if (window.innerWidth >= 768) {
					if ( $('.js-plp-container').hasClass('closed') ) {
						$('.js-filter-toggle small').text( __('Show') );
					} else {
						$('.js-filter-toggle small').text( __('Hide') );
					}
				}
				else if (window.innerWidth < 768) {
					$('.js-filter-toggle small').text( __('Show') );
				}
			}, false);
		};

		
		/**
		* Show more filers when there's more than 10 filer options in the filter group
		* @param none 
		* @return none
		*/
		my.showMoreFiltersWhenThereAreMoreThan10 = function() {
			$('.js-refinements').each(function(){
				var $that 			= $(this);
				var $filters		= $('label', this);						//Filters
				var $showMoreLink	= $(this).next('.js-filter-expand');	//Show more link
				
				
				if ( $filters.length > 10 ) {
					$showMoreLink.show();		//Show the 'Show more' button
					
					$showMoreLink.click(function() {
						var txt = $that.hasClass('expanded') ? __('Show more') : __('Show less');
						$that.toggleClass('expanded');	//Add a class of expanded (which removes the max-height in css)
						$(this).text(txt);				//Toggle the text between 'Show more' and 'Show less'
						return false;
					});
				}
			}); 
		};


		/**
		* Filter the list of brands via a <select> list
		* @param none 
		* @return none
		*/
		my.filterBrandsUsingSelect = function() {			
			$('#js-brand-az-filter').change(function(){
				var selectedLetter = $(this).val().toUpperCase();
				var $listItems = $('.js-brand-filter-list a').parent();
				
				$listItems.removeClass('hide');		//Reset the filtered list

				if (selectedLetter != 'ALL') {
					$('.js-brand-filter-list a:not( [id^="b_' + selectedLetter + '"] )').parent().addClass('hide');	//Hide the brands that do not have an ID that starts with 'b_[selected letter]'
					$('.js-brand-filter-list').addClass('expanded');	//Expand the panel so all the filtered brands are shown....
					$(this).siblings('.js-filter-expand').addClass('hide');		//...and hide the show/hide link
				}
				else {
					//Make sure the panel is not expanded if the whole list is shown and show the show/hide link
					$('.js-brand-filter-list').removeClass('expanded');
					$(this).siblings('.js-filter-expand').removeClass('hide').text(__('Show more'));
				}		
			});
		};	


		/**
		* Create the price slider on PLP
		* Plugin used: http://refreshless.com/nouislider/
		* @param none 
		* @return none
		*/
		my.createPriceSlider = function() {			
			if ( $('#js-plp-price-slider').length > 0 ) {
				var priceFrom = parseInt($('#js-tag-pricefrom').text());	//Upper slider handle
				var priceTo = parseInt($('#js-tag-priceto').text());		//Lower slider handle
				var minPrice = parseInt($('#js-tag-minprice').text());		//Minimum slider range price
				var maxPrice = parseInt($('#js-tag-maxprice').text());		//Maximum slider range price
				var currencySymbol = $('#js-tag-cursymbol').text();			//Currency symbol

				
				//Init the slider. See plugin docs for options. http://refreshless.com/nouislider/slider-options/
				$('#js-plp-price-slider').noUiSlider({
					start	: [priceFrom, priceTo],
					step	: 10,
					connect	: true,
					range	: {
						'min': minPrice,
						'max': maxPrice
						
					},
					format: wNumb({
						decimals: 0,
						prefix: currencySymbol
					})
				});
				
				
				//Show the pips on the slider. http://refreshless.com/nouislider/pips/
				$("#js-plp-price-slider").noUiSlider_pips({
					mode	: 'count',
					values	: 3,
					density	: 4,
					format	: wNumb({
						decimals: 0,
						prefix: currencySymbol
					})
				});
				
				
				//Show the values of both handles as tooltips
				$("#js-plp-price-slider").Link('upper').to('-inline-<div class="price-slider-tooltip"></div>', function ( value ) {

					// The tooltip HTML is 'this', so additional markup can be inserted here.
					$(this).html('<span>' + value + '</span>');
				});

				$("#js-plp-price-slider").Link('lower').to('-inline-<div class="price-slider-tooltip"></div>', function ( value ) {

					// The tooltip HTML is 'this', so additional markup can be inserted here.
					$(this).html('<span>' + value + '</span>');
				});
			}
		};		

		my.init = function() {
			this.showHideFilters();
			this.showMoreFiltersWhenThereAreMoreThan10();
			this.filterBrandsUsingSelect();
			this.createPriceSlider();
		};

		return my;

	})(module);

	return module;
});