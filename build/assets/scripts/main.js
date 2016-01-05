"use strict"
require.config({
    baseUrl : '/assets/scripts',
    shim : {
        'matchmedia' : {
            exports : 'matchmedia'
        },
        'matchmedia_listener' : {
            deps : ['matchmedia'],
            exports : 'matchmedia_listener'
        },
        'hammerjs' : {
            exports : 'Hammer'
        },
        'iscroll' : {
            exports : 'IScroll'
        },
		'nouislider' : {
			dep : ['jquery'],
            exports: '$'
		},
        'easings' : {
            dep : ['jquery'],
            exports: '$'
        },
        'anythingzoomer' : {
            exports : 'anythingzoomer'
        },
        'smoothzoompan' : {
            exports : 'smoothzoompan'
        },
        'nprogresscore' : {
            deps : ['css!nprogresscss']
        },
        'zurbresponsivetables' : {
            deps : ['jquery'],
            exports: '$'
        },
        'videojs' : {
            deps : ['css!videojscss']
        }
    },
    paths : {
        jquery 		        : 'lib/jquery-1.11.2',
        easings             : 'lib/jquery.easing.1.3',
        ko 			        : 'lib/knockout-3.2.0',
        modernizr 	        : 'lib/modernizr',
        matchmedia 	        : 'lib/matchMedia',
        matchmedia_listener : 'lib/matchMedia.addListener',
        hammerjs            : 'lib/hammer.min',
        hammerify	        : 'lib/jquery.hammer',
        isotope 	        : 'lib/isotope.pkgd.min',
        iscroll_lite        : 'lib/iscroll-lite',
        iscroll             : 'lib/iscroll',
		nouislider 	        : 'lib/jquery.nouislider.all.min',
        jquery_validate	    : 'lib/jquery.validate',
        fastclick           : 'lib/fastclick',
        cookie              : 'lib/jquery.cookie',

        hooks 		        : 'app/hooks',
        breakpoints         : 'app/breakpoints',
        conditionals        : 'app/conditionals',

        utils 		        : 'app/lib/utils',
        gtm                 : 'app/lib/gtm', // Google Tag Manager

        carousel	        : 'app/plugins/carousel',
        form_validate	    : 'app/plugins/form-validation',
		swatches            : 'app/plugins/swatches',
        hovertouch          : 'app/plugins/hovertouch',

        tabs 		        : 'app/modules/tabs',
        minicart 	        : 'app/modules/minicart',
        megamenu 	        : 'app/modules/megamenu',
        search_suggestions  : 'app/modules/search-suggestions',
        ui 			        : 'app/modules/ui',
        my_account	        : 'app/modules/my-account',
        plp 		        : 'app/modules/plp',
        pdp                 : 'app/modules/pdp',
        product             : 'app/modules/product',
        basket 		        : 'app/modules/basket',
        contact_us 		    : 'app/modules/contact-us',
        postbox 	        : 'app/modules/postbox',
        edit_payments       : 'app/modules/edit-payments',
        overlay             : 'app/modules/overlay',
        offcanvas           : 'app/modules/offcanvas',
        progress            : 'app/modules/progress',
        postcode_lookup     : 'app/modules/postcode-lookup',
        back_to_top         : 'app/modules/back-to-top',
        current_offers      : 'app/modules/current-offers',
        swatches_toggle     : 'app/modules/swatches-toggle',

        anythingzoomer      : '../vendor/anythingzoomer/js/jquery.anythingzoomer',
        anythingzoomercss   : '../vendor/anythingzoomer/css/anythingzoomer',
        smoothzoompan       : '../vendor/smoothzoompan/jquery.smoothZoom.min',
        nprogresscore       : '../vendor/nprogress/nprogress',
        nprogresscss        : '../vendor/nprogress/nprogress',
        zurbresponsivetables: '../vendor/zurb-responsive-tables/responsive-tables',
        videojs             : '../vendor/video-js/video',
        videojscss          : '../vendor/video-js/video-js'
    },

    map: {
        '*': {
            'css': 'lib/require-css/css',
            'less': 'lib/require-less/less'
        }
    }
});

// Attach FastClick as soon as possible
require(['fastclick'], function(FastClick) {
    FastClick.attach(document.body);
});

/**
 * Utils
 * Hooks
 * Conditionals - Load modules based on different conditions
 * Google Tag Manager
 */
require(['utils', 'hooks', 'conditionals', 'gtm'], function(utils, hooks, conditionals, GTM) {
    utils.init();

    GTM.page({
        http_response_code : 200,
        name : ""
    });
});

require(['jquery', 'breakpoints', 'hovertouch', 'hammerify'], function($, breakpoints, ht, hammerify) {

    // Set a class to incidate that this site is JavaScript enabled
    $('.no-js').addClass('js').removeClass('no-js');

    breakpoints.dispatch('md', function(query) {
         $('.header').on('touchstart.md click.md', '.icon-close', function() {
            $(this).parents('.menu').removeClass('hover');
            return false;
        });
    });

    // Binds to the live update of the breakpoint to work with iPad.
    breakpoints.update.md().addListener(function() {
        // When switching back and forth between resolutions, close the latest open "hover" element
        if($.hovertouch) {
            $.hovertouch.close();
        }
    });

    // X icons on mobile have different behavior
    breakpoints.uptoMd.addListener(function() {
        $('.header .icon-close').off('touchstart.md click.md');
    });

    // Any component that is only shown as a message.
    $('.flash-message .js-close').on('touchstart click', function() {

        var cookie = require(['cookie']);

        var container = $(this).parents('.flash-message');

        container.animate({
            height : 0
        }, function() {
            $(this).remove();

            $.cookie('hof_flash_close', 1);
        });

        return false;
    });

    $(function() {
        var move = false;

        $('.menu-name').hammer().on('tap', function() {
            
            if(move == false) {
                var $parent = $(this).parents('.hover').eq(0);
                if($parent.hasClass('hover')) {
                    $parent.removeClass('hover');
                    return false;
                }
            }
            move = false;
        }).on('touchmove', function() {
            move = true;
        });

        $('.menu').hovertouch();
        $('.structure > li').hovertouch();
    });
});