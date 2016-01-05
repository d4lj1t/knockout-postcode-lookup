define([], function() {

	"use strict";

	require(['jquery', 'swatches', 'utils'], function($, swatches, utils) {

		function mark_swatch_as_selected(swatch) {
			var $swatch = $(swatch),
				$swatches = $swatch.parents('.swatches-container').eq(0).find('.swatch');

			$swatches.removeClass('selected');
			$swatch.addClass('selected');
		}

		// Handle swatches clicking and changing
		postbox.subscribe(function(swatch) {

			// Destroy previously added notice
			$('.product-unavailable-notice').remove();
			
			mark_swatch_as_selected(swatch);
		}, null, 'swatch_selected');

		// Handle swatche clicking when variation is not available
		postbox.subscribe(function(swatch) {

			// Destroy previously added notice
			$('.product-unavailable-notice').remove();

			mark_swatch_as_selected(swatch);

			var notice = $('<div>').addClass("product-unavailable-notice");
			notice.html(__('Size not available in selected colour.'));

			$('.product-images-carousel').append( notice );

		}, null, 'swatch_unavailable');

		$('.product-sidebar .swatches-container').swatches({
			swatch : '.swatch',
			afterOpening : function() {
				this.toggleBtn.find('.icon-block-plus').removeClass('icon-block-plus').addClass('icon-block-minus');
			},
			afterClosing : function() {
				this.toggleBtn.find('.icon-block-minus').removeClass('icon-block-minus').addClass('icon-block-plus');
			}
		});

	});
	
	require(['jquery', 'carousel', 'breakpoints', 'postbox', 'ko', 'product', 'progress', 'hammerjs','anythingzoomer', 'css!anythingzoomercss', 'cookie'], 
	function($, carousel, breakpoints, postbox, ko, Product, progress, Hammer, cookie) {

	$(function() {

		// Product summary
		var product = new Product.getInstance({
			name : 'Larkee 8XR Straight Fit Jeans',
			brand : 'Diesel',
			price : 90,
			colour : '',
			size : ''
		});

		// Commented due to conflicts with another KO bind by IT team.
		//ko.applyBindings(product, document.getElementById('product-single'));

		// Show/hide more deliver info
		(function() {
			var previous = null;

			$('.js-show-more-delivery-info-content').on('click', function() {

				var content_element_id 	= $(this).attr('aria-controls'),
					$content_element 	= $('#' + content_element_id);

				if($content_element.attr('aria-hidden') == 'true') {

					if(previous !== null) {
						$(previous).trigger('click');
					}

					// Hide any other open
					previous = this;

					$content_element.css('display', 'block').attr('aria-hidden', 'false');
					$(this).html(__('Less info'));
				} else {

					$content_element.css('display', 'none').attr('aria-hidden', 'true');
					$(this).html(__('More info'));

					previous = null;
				}

				return false;
			});
		})();

		// Add a magnification zoom to the PDP carousel
		(function() {

			var productImagesCopy = null;

			function addAnythingZoom() {

				productImagesCopy = $('.product-images-carousel').clone(true);

				$('.product-images-carousel img').each(function() {
					$(this).wrap('<div class="small"></div>');

					var src = $(this).attr('src'),
						zoomImage = $(this).data('large');

					$(this).parent().after('<div class="large"><img src="' + zoomImage + '"></div>');
				});

				$('.product-images-carousel .item').not('.video').anythingZoomer({
					offsetX : -26,
					offsetY : -26,
					switchEvent : 'doesnotexistsevent' // Disable functionality with non existing event
				});
			}

			function removeAnythingZoom() {

				$('.product-images-carousel').replaceWith(productImagesCopy);
			}

			breakpoints.dispatch('md', function(query) {
				// Add necessary bits for the AnythingZoomer to works
				if(query.matches) {
					addAnythingZoom();
				// Swipe out the unnecessary bits
				} else {
					removeAnythingZoom();
				}
			});

		})();

		// Add a megazoomer
		(function() {

			var overlay = null, listOfImages = ['<ul>'], $items = $('.product-images-carousel .item');

			$items.each(function(index) {
				if($(this).hasClass('video')) {
					listOfImages.push( '<li class="thumb" data-type="video" data-index="' + index + '"><img src="' + $(this).data('thumb') + '" alt=""></li>' ); 
				} else {
					listOfImages.push( '<li class="thumb" data-type="image" data-index="' + index + '"><img src="' + $(this).find('img').data('thumb') + '" data-large="' + $(this).find('img').data('large') + '" alt=""></li>' );
				}
			});
			listOfImages.push('</ul>');

			var init_megazoom = function() {

				var $item = $(this),
					$video = null,
					$video_placeholder = null;

				require(['overlay', 'smoothzoompan'], function(Overlay, smoothzoompan) {

					if(overlay === null) {
						overlay = new Overlay({
							className : 'megazoom',
							onOpen : function() {
								$('#zoom').smoothZoom(options);
								$('html').hammer().on('doubletap', function() {
									$('#zoom').smoothZoom('zoomIn');
								});
							},
							onClose : function() {


								if($video !== null) {
									$video_placeholder.append($video);
								}

								$('#zoom').smoothZoom('destroy').remove();
							}
						});

						overlay.content('<div class="thumbs col-xs-1">' + listOfImages.join('') + '</div><div class="canvas col-xs-11"></div>').prepare();
					}

					$('.megazoom .canvas').html('<img id="zoom" src="'  + $item.find('img').data('large') + '" alt="">');
					
					var options = {
						width : '100%',
						height : '100%',
						responsive : true,
						responsive_maintain_ratio:true,
						zoom_MAX : 100,
						border_SIZE : 0
					};

					$('.thumbs .thumb').off('click').on('click', function() {

						var index = $(this).data('index'),
							$item = $items.eq(index);

						switch( $(this).data('type') ) {
							case 'video':

								if( $video === null ) {
									$video = $item.children().eq(0);

									// First child is the placeholder instead of the video
									if($video.hasClass('video-placeholder')) {
										$video_placeholder = $video;
										$video = $video.children().eq(0);
									} else {
										$video.wrap('<div class="video-placeholder"></div>');
										$video_placeholder = $video.parent(); 
									}
								}

								$('.megazoom .canvas').html($video);

							break;

							default: 
							case 'image':
								$('.megazoom .canvas').html('<img id="zoom" src="'  + $item.find('img').data('large') + '" alt="">');
								$('#zoom').smoothZoom('destroy');
								$('#zoom').attr('src', $(this).find('img').data('large')).smoothZoom(options);
							
						}

						return false;
					});

					overlay.show();
				});
			};

			if( 'ontouchstart' in window) {

				$('.product-images-carousel .item:not(.video)').hammer().on('doubletap', init_megazoom);
			} else {

				// Needs to be delegated because of cloning of items in carousel
				$('.product-images-carousel').on('click', '.item:not(.video)', init_megazoom);
			}

		})();

		// Sticky header
		(function() {
			
			var shown = false, animating = false;

			$(window).scroll(function() {

				if(animating === true || breakpoints.md.matches === false) {
					return true;
				}
				
				animating = false;

				if( $(document).scrollTop() > $('.product-sidebar .btn-add-to-bag').offset().top) {
					if(shown === false) {
						animating = true;
						$('.pdp-sticky-header').fadeIn({
							complete : function() {
								shown = true;
								animating = false;
							}
						});
					}
				} else {
					if(shown) {
						animating = true;
						$('.pdp-sticky-header').fadeOut({
							complete : function() {
								shown = false;
								animating = false;
							}
						});
					}
				}
			});
		})();

		// Stick header mega zoom
		(function() {
			$('.pdp-sticky-header .col-image').click( function() {

				$('.product-images-carousel .item').eq(0).trigger('click');

				return false;
			});
		})();

		// Size guide
		(function() {
			var overlay = null;
			$('.js-show-size-guide').on('touchstart click', function() {

				progress.start();

				require(['overlay', 'utils'], function(Overlay, utils) {
					if(overlay === null) {
						overlay = new Overlay({
							onOpen : function() {
								progress.done();
							}
						});
						overlay.content($('#product-size-guide').html());
					}
					overlay.show();
					utils.unitToggle();
				});

				return false;
			});
		})();

		// Handle product sidebar toggling
		(function() {

			var animating = false;
			var productSidebarToggleBtn = $('.js-pdp-toggle-sidebar'),
				controls 				= $('.product-sidebar .controls');

			// Watch for breakpoints change and reset sidebar height
			breakpoints.update.uptoMd().addListener(function(query) {

				if(query.matches && productSidebarToggleBtn.hasClass('closed') ) {
					productSidebarToggleBtn.trigger('click');
				}
			});

			productSidebarToggleBtn.click(function() {

				if(animating === true) {
					return false;
				}

				var expanded_height = null,
					collapsed_height = 60,
					nextImageArrow 	= $('.product-images-carousel-control.next');

				if($(this).hasClass('closed')) {
					expanded_height = controls.height('').height();
					controls.height(collapsed_height);

					nextImageArrow.animate({
						right : 318
					});

					controls.animate({
						height : expanded_height
					}, function() {
						animating = false;
						controls.height('');
					});

					$('.js-pdp-sidebar-toggle-text').html(__('Hide'));
					$('.js-pdp-sidebar-toggle-icon').removeClass('icon-block-plus').addClass('icon-block-minus');

					$(this).removeClass('closed');
				} else {

					var product = Product.getInstance();

					animating = true;

					controls.animate({
						height : collapsed_height
					}, function() {
						nextImageArrow.animate({
							right : 10
						}, function() {
							animating = false;
						});
						$('.js-pdp-sidebar-toggle-text').html(__('Show'));
						$('.js-pdp-sidebar-toggle-icon').removeClass('icon-block-minus').addClass('icon-block-plus');
					});
					$(this).addClass('closed');
				}
				
				return false;
			});
		})();

		// Product details page main carousel with product images
		$('.product-images-carousel').carousel({
			thumbs : '.carousel-thumbs',
			selectorPrev : '.product-images-carousel-control.prev',
			selectorNext : '.product-images-carousel-control.next'
		});


		function init_ocab_carousel() {
			// Product details page - tabs with Other customers also bought
			$('.product-ocab-carousel').carousel({
				infinite : false,
				selectorPrev : function() {
					return $(this).find('.prev');
				},
				selectorNext : function() {
					return $(this).find('.next');
				},
				batches : [
					{test : breakpoints.md, batch : 3},
					{test : breakpoints.uptoMd, batch : 0}
				]
			});
		}

		function init_ocav_carousel() {
			// Product details page - tabs with Other customers also viewed
			$('.product-ocav-carousel').carousel({
				infinite : false,
				selectorPrev : function() {
					return $(this).find('.prev');
				},
				selectorNext : function() {
					return $(this).find('.next');
				},
				batches : [
					{test : breakpoints.md, batch : 3},
					{test : breakpoints.uptoMd, batch : 0}
				]
			});
		}

		breakpoints.md.addListener(function() {
			init_ocab_carousel();
			init_ocav_carousel();
		});

		init_ocab_carousel();
		init_ocav_carousel();

		// Watch for "Other customers also bought" tab to be opened and then trigger this carousel
		postbox.subscribe(function(value) {
			if(value == 'ocab-tab') {
				init_ocab_carousel();
			}

			if(value == 'ocav-tab') {
				init_ocav_carousel();
			}

		}, null, 'tab_opened');

		// Get all the necessary libraries for the videoJS player
		require(['videojs']);
		
		
		/**
		 * Set the RVI cookie with the current PDP SKU.
		 * @param {string} product sku
		 * @param {string} name of cookie for rvi
		 * @return none
		 */
		function setRVICookie(sku, cookieName) {			
			var rviCookieOptions = { expires: 365, path: '/' };
			var rviCookie = $.cookie(cookieName); 	// String or undefined
			
			if (rviCookie) {
				//Create array from cookie string
				rviCookie = rviCookie.split(',');
				
				
				// Don't need to set the cookie if this item is already in the list.
				for (var i = 0; i < rviCookie.length; i++) {
					if (rviCookie[i] == sku) {
						return;
					}
				}
				
				//Add the SKU to the array and set the cookie
				rviCookie.unshift(sku);	
				$.cookie(cookieName, rviCookie, rviCookieOptions);	
			} else {
				$.cookie(cookieName, sku, rviCookieOptions);
			}			
		}
		
		//NOTE TO SWINDON
		//prodSku SHOULD BE RETRIVED FROM THE PRODUCT DATA MODEL NOT THE DOM
		//PLEASE UPDATE THE BELOW VARIABLE WITH APPROPRIATE PRODUCT MODEL DATA
		var prodSku = $('.sku').text();
		setRVICookie(prodSku, 'hof_rvi');
		
	});

	});
});