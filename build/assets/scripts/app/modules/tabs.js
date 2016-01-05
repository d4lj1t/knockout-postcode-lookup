define(['jquery', 'iscroll', 'breakpoints', 'postbox', 'offcanvas', 'progress'], function($, IScroll, breakpoints, postbox, Offcanvas, progress) {

	/**
	 * @tabsParent - The top most element of the tabs component. It can be either a selector or DOM/Jquery object.
	 * @tabsSelector - Relative (to tabsParent) selector for the tabs.
	 */
	var tabs = function(tabsParent, tabsSelector) {
		this.tabsParent = $(tabsParent);
		this.tabsSelector = this.tabsParent.find(tabsSelector);
		this.scroll = null;
		this.elBody = $('body');
		this.elCR 	= $('.container-responsive');
		this.tab_ids = [];
		this.behavior = this.tabsParent.data('tabs-behavior');
		this.offcanvas = null;
		if(typeof this.behavior === 'undefined') {
			this.behavior = 'none';
		}

		this.init();
	};

	tabs.prototype.init = function() {
		this.bindEvents();
	};

	tabs.prototype.resetOffCanvas = function() {
		$('.off-canvas-component').remove();
		this.elBody.off('transitionend');
		if(this.elPreventTouchEvents) {
			this.elPreventTouchEvents.remove();
		}
		if(this.scroll) {
			this.scroll.destroy();
			this.scroll = null;
		}
		$(document).off('touchstart.component');
		this.elBody.removeClass('off-canvas off-canvas-right');
	};

	tabs.prototype.reset = function() {
		var self = this;

		this.elBody.on('transitionend', function() {
			//self.resetOffCanvas();
		});
	};

	tabs.prototype.onClick = function(el) {
		var tab_id = $(el).attr('id');
			tab_id = tab_id.replace(/-tab/, '');

		//var parent = $(el).parents('.tabs').eq(0);

		// Standard tabs on medium resolutions or on smaller resolutions that has no specific behavior
		if(this.behavior == 'none' || breakpoints.md.matches) {
			var tabs = $(el).parents('.nav-tabs');
			tabs.find('li').removeClass('active');
			var parent = $(el).parent();
			parent.addClass('active');

			var tabs_content = tabs.next();
			tabs_content.find('.active').removeClass('active');
			tabs_content.find('#' + tab_id).addClass('active');
		} else if(this.behavior == 'off-canvas' && breakpoints.md.matches === false) {

			progress.start();

			if(this.offcanvas === null) {
				this.offcanvas = new Offcanvas({
					container 	: $('.container-responsive'),
					floating 	: true,
					scroll 		: false,
					closeControl: true
				});
			}

			this.offcanvas.setContent( $('#' + tab_id) );
			this.offcanvas.open();

			progress.done();
		}

		return false;
	};

	tabs.prototype.bindEvents = function() {
		
		var self = this;

		$(this.tabsSelector).on('click', function() { 

			// Do not prevent events from bubbling when the off canvas component is opened.
			if(!self.offcanvas || self.offcanvas.isOpened() === false) {
			
				self.onClick(this);
					
				// Notify subscribers that tab with ID is now open
				postbox.notifySubscribers($(this).attr('id'), 'tab_opened');

				return false;
			}
		});

		breakpoints.uptoMd.addListener(function(query) {
			
			if(self.behavior == 'accordion' && query.matches) {
				
				self.transformAccordion();
			}
		});


		breakpoints.md.addListener(function(query) {

			if(self.behavior == 'off-canvas' && query.matches) {
				//self.resetOffCanvas();
				return false;
			}

			if(self.behavior == 'accordion' && query.matches) {
				for(var i = 0; i < self.tab_ids.length; i++ ) {
					var tab_content = $('#' + self.tab_ids[i]);
					var tab_placeholder = $('#' + self.tab_ids[i] + '-placeholder');
					tab_placeholder.append(tab_content);
				}
			}
		});

		if(this.behavior == 'accordion' && breakpoints.uptoMd.matches) {
			this.transformAccordion();
		}
	};

	tabs.prototype.transformAccordion = function() {
		var self = this;

		$(this.tabsSelector).each(function() {
			var id = $(this).attr('id');
			var tab_id = id.replace(/-tab/, '');
			var parent = $(this).parent();
			var tab_content = $('#' + tab_id);
			var tab_placeholder_id = tab_id + '-placeholder';
			if($('#' + tab_placeholder_id).length === 0) {
				tab_content.wrap('<div id="' + tab_placeholder_id + '" class="tab-placeholder"></div>');
			}
			self.tab_ids.push(tab_id);

			parent.append($('#' + tab_id));

			if(postbox) {
				postbox.notifySubscribers(id, 'tab_opened');
				postbox.notifySubscribers(id, 'tabs_behavior_changed');
			}
		});
	};

	return tabs;
});