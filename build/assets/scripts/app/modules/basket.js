/**
 * Itinerary - my-bag.html
 * position fixed on scroll
 */
define(['jquery', 'breakpoints'], function ($, breakpoints) {
    var module = (function (my) {

        "use strict";

        var itineraryTriggerPosition = $('.js-itinerary').offset().top;

        if (!my) {
            my = {};
        }

        my.itinerary = function () {

            var $d = $(document),
                $w = $(window),
                $it = $('.js-itinerary'),
                $b = $('body'),
                $itw = null, // Wrapper element
                $jsParent = $('.js-itinerary-parent'),
                $fb = $('.js-itinerary-snapped-trigger'),
                parentHeight = $jsParent.height(),
                documentHeight = $d.height(),
                windowHeight = $w.height(),
                offset = $it.offset(),
                width = $it.outerWidth(),
                height = $it.outerHeight(),
                breakPoint = 0,
                saveScroll = null,
                placed = false;

            $it.wrap('<div />');
            $jsParent.css('position', 'relative');

            $itw = $it.parent();

            function position() {

                // On resolutions that are smaller than medium the itinerary should not act at all.
                if(!breakpoints.md.matches) {

                    if(placed) {
                        $itw.append($it);
                        placed = false;
                    }

                    $it.width('');
                    $it.removeClass('itinerary-snapped itinerary-fixed');

                    return true;
                }

                // Itinerary is too big. .height() should be used to get height in real time as it may change for both itinerary or parent.
                // 200 is the vertical space required before itinerary kicks in. Might need adjustment.
                if ($it.height() > ($jsParent.height() - 200)) {
                    return;
                }

                var st = $d.scrollTop(),
                    width = $it.outerWidth();

                // Point where itinerary's bottom is aligned with left hand side content
                var b = (st + height + 35);

                // Point where itinerary should snapped to footer
                breakPoint = parseInt($fb.offset().top, 10);

                // Should the itinerary snapped to the footer?
                if (b >= breakPoint) {

                    $it.css({
                        width: width
                    }).removeClass('itinerary-fixed').addClass('itinerary-snapped');

                    // Move the itinerary DOM element to a relative element
                    if (placed === false) {
                        $jsParent.append($it);
                        placed = true;
                    }
                    // Or should it float with the screen
                } else if ((st + 20) >= offset.top) {

                    $it.css({
                        width: width
                    }).removeClass('itinerary-snapped').addClass('itinerary-fixed');

                    // Move the itinerary's DOM element back
                    if (placed) {
                        $itw.append($it);
                        placed = false;
                    }
                    // Or remains static (Default)
                } else {

                    placed = false;
                    $it.css({
                        width: ''
                    }).removeClass('itinerary-fixed itinerary-snapped');
                }
            }


            $w.on('scroll.itinerary', position);
            window.addEventListener('resize', function () {
                placed = false;
                $it.css({
                    width: ''
                }).removeClass('itinerary-fixed itinerary-snapped');
                $itw.append($it);
            }, false);
            $w.on('resize', position); // Resize is required to handle changing different resolutions

            // Set the position when page is loaded
            position();


        };


        my.bindEvents = function () {
            var self = this,
                init = false;

            breakpoints.dispatch('md', function () {
                if (init === false) {
                    self.itinerary();
                    init = true;
                }
            });
        };

        my.init = function () {
            this.bindEvents();
        };

        return my;

    })(module);

    return module;

});