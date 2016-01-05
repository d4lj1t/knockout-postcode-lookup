/**
 * The starting actions for more larger modules which are not needed in page load.
 */
define(['jquery', 'breakpoints', 'progress'], function($, breakpoints, progress) {

	var clickEvent = "ontouchstart" in window ? 'touchstart' : 'click';

	$('.quick-search input[type=search], .quick-search-mobile input[type=search]').focus(function() {
		var self = this;
		
		// Show progress bar only if Search Suggestions is not loaded
		if(require.defined('search_suggestions') === false) {
			progress.start();
		}
		
		require(['search_suggestions'], function(ss) {
			ss.init(self);
		});
	});

	$('.postcode-search input[type=search]').focus(function() {
		var self = this;

		// Show progress bar only if Search Suggestions is not loaded
		if(require.defined('postcode_lookup') === false) {
			progress.start();
		}

		require(['postcode_lookup'], function(ss) {
			ss.init(self);
		});
	});

	$('.js-show-search-box').on(clickEvent, function() {

		var element = $('.quick-search-mobile');

		element.hovertouch(function(e) {

			if($(this).hasClass('hover')) {
				var $target = $(e.target);
				// Remove hover state on certain conditions
				if($target.hasClass('js-show-search-box') || $target.hasClass('icon-search-default')) {
					$(this).hovertouch('remove');
					return false;
				}
			}

		});

		require(['search_suggestions'], function(ss) {
			ss.initMobile($('.quick-search-mobile input'));
		});
	});

	// Open minicart
	$('.js-open-off-canvas-minicart').on(clickEvent + '.click.hook.off-canvas-minicart', function() {
		if(breakpoints.update.uptoMd().matches) {
			progress.start();
			require(['minicart'], function(minicart) {
				minicart.init();
			});
			$(this).off(clickEvent + '.hook.off-canvas-minicart');
		}
	});

	// Open off-site navigation
	$('.js-open-off-site-nav').on(clickEvent + '.hook.off-site-nav', function(e) {
		if(breakpoints.uptoMd.matches) {
			progress.start();
			require(['megamenu'], function(megamenu) {
				megamenu.init();
			});
			$(this).off(clickEvent + '.hook.off-site-nav');
		}
		// Must return false in order to stop iPad issues
		$.hovertouch.close();
		return false;
	});

	// Open "My account" menu
	$('.js-open-my-account').on(clickEvent + '.hook.my-account', function() {
		if(breakpoints.uptoMd.matches) {
			progress.start();
			require(['my_account'], function(my_account) {
				my_account.init();
			});
			// Stop watching for this hook once the module is loaded.
			$(this).off(clickEvent + '.hook.my-account');
		}
	});

});