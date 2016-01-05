/**
 * Offcanvas
 */
define(['jquery', 'iscroll', 'breakpoints'], function($, IScroll, breakpoints) {

	"use strict";

	var Offcanvas = function(options) {

		var settings = $.extend({
			
			// Describes the screen position where the content will be displayed. Options: [left, right]
			position : 'right',
			// The content is usually anchored at the top right (or left) corner of the screen. Setting this to "true" (boolean)
			// will position the content block with the same offset of the current scroll position.
			floating : false,
			// Use iScroll library for better scroll support. This will increase load time.
			scroll : true,
			// When moving the content to the off canvas component, create an empty placeholder to return the content when it is closed
			placeholder : true,
			// Main class to by applied on component element. It is also used as prefix for other helper classes.
			className : "off-canvas",
			// A must define object. Usually it is a wrapper of the entire <body> content
			container : null,
			// Callback
			onAfterClose : function() {},
			// Callback
			onAfterOpen : function() {},
			// Add close control or not
			closeControl : false

		}, options);

		var $body = $('body'),
			$html = $('html');

		// Actual content reference
		var $content = null;

		// Component
		var $component = null;

		var $contentWrap = null;

		var $placeholder = null;

		var $container = null;

		var scroll = null;

		var bodyClasses = "";

		var offCanvasPlaceholderId = null;

		// If the page needs more than one off canvas component, not having an unique id for every instance may cause clashes.
		var uniqueId = parseInt( Math.random() * 1000000 );

		// Is the component opened or not. Options: true or false
		var opened = false;

		// If transition is triggered by human or from another source. True == human
		var triggered = false;

		var original_body_position;

		this.isOpened = function() {
			return opened;
		};

		this.setContent = function(content) {
			$content = $(content);
		};

		// Prepare DOM for setting content and performing actions 
		this.prepare = function() {

			var self = this;

			// Shorthand
			$container = settings.container;

			bodyClasses = [settings.className, settings.className + '-' + settings.position].join(' ');

			var componentClasses = [settings.className, '-component'].join('');

			// Create component
			$component = $('<div class="' + [componentClasses, componentClasses + '-' + settings.position].join(' ') + '"></div>');
			$contentWrap = $('<div class="' + [settings.className, '-content-wrap'].join('') + '"></div>');

			if(settings.closeControl) {
				$component.append('<a class="icon-close close-control js-close-control" href="#"></a>');
				$component.find('.js-close-control').click(function() {
					
					self.close();

					return false;
				});
			}

			$component.append($contentWrap);
		};
		
		// Open component
		this.open = function() {

			if(opened === false) {

				// Human
				triggered = true;

				if(settings.placeholder && $placeholder === null) {
					offCanvasPlaceholderId = [settings.className, '-placeholder-id-' + uniqueId].join('');
					$content.wrap('<div class="' + [settings.className, '-placeholder'].join('') + '" id="' + offCanvasPlaceholderId + '"></div>');
					$placeholder = $('#' + offCanvasPlaceholderId);
				}

				// Add content to the component
				$contentWrap.append($content);

				if(settings.floating === true) {

					/*
					
					Old browsers support code.

					$component.css({
						top : $(document).scrollTop()
					});

					// Change the position of the floating off-canvas element. In some cases when changing orientation the initial top position changes and needs to be reset.
					$(window).on('orientationchange.off-canvas', function() {
						setTimeout(function() {
							$component.css({
								top : $(document).scrollTop()
							});
						}, 100);
					});
					*/

					$component.addClass('floating');
				}

				$body.append($component);

				$body.addClass(bodyClasses);
			}
		};

		// Close component
		this.close = function() {

			if(opened === true) {
			
				// Human
				triggered = true;

				$body.removeClass(bodyClasses);	
			}
		};

		// Toggle between open and close methods
		this.toggle = function() {
			this[opened ? 'close' : 'open']();
		};

		// Callback after component is revealed
		this.onAfterOpen = function() {
			this.bindCloseEvent();

			if(settings.scroll) {
				if(scroll === null) {
					scroll = new IScroll($component.get(0), {
						scrollbars : true,
						mouseWheel : true
					});
				} else {
					scroll.refresh();
				}
			}

			// Save <body> position
			original_body_position = $body.css('position');

			if(settings.floating === false) {

				// Helper values to prevent page scrolling
				$html.css({
					overflow : 'hidden',
					height : '100%'
				});

				// It is required to stop page scrolling. For some reason it doesn't work when it is set via css.
				$body.css({
					position: 'relative'
				});
			}

			settings.onAfterOpen();
		};

		// Callback after component is closed
		this.onAfterClose = function() {
			
			if(settings.placeholder) {
				$placeholder.append($content);
			}

			// If iScroll is used, destroy it
			if(scroll) {
				scroll.destroy();
				scroll = null;
			}

			if(settings.floating === false) {

				// Set <html> values to browser default
				$html.css({
					overflow : 'auto',
					height : 'auto'
				});

				// Restore <body> position
				$body.css({
					position : original_body_position
				});
			}

			// Remove click event from container when off canvas is closed to restore previous behavior.
			this.unbindCloseEvent();

			settings.onAfterClose();
		};

		this.bindCloseEvent = function() {
			var self = this;

			$container.on('click.' + uniqueId + ' touchstart.' + uniqueId, function() {
				self.close();
				return false;
			});
		};

		this.unbindCloseEvent = function() {
			$container.off('click.' + uniqueId + ' touchstart.' + uniqueId);
		};

		this.bindEvents = function() {

			var self = this;

			this.bindCloseEvent();

			// Bind on transition end. 
			// webkitTransitionEnd needed for older Android Browser.
			$container.on( 'transitionend.' + uniqueId + ' webkitTransitionEnd.' + uniqueId, function(e) {

				if(triggered === true) {
					if(opened === false) {
						self.onAfterOpen();
						opened = true;
					} else {
						self.onAfterClose();
						opened = false;
					}
					triggered = false;
				}
			});

			// Close the offcanvas component when going back to desktop resolution
			breakpoints.update.md().addListener(function(query) { 
				if(query.matches) {
					self.close();
				}
			});
		};

		this.init = function() {
			this.prepare();
			this.bindEvents();
		};

		this.refresh = function() {
			if(scroll !== null) {
				scroll.refresh();
			}
		};

		this.getContentWidth = function() {
			return $content.width();
		};

		this.getWidth = function() {
			return $component.width();
		};

		this.init();
	};

	return Offcanvas;

});