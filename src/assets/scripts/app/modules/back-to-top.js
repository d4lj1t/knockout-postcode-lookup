/**
 * Edit payment
 * click edit to edit the card
 */
define(['jquery', 'breakpoints'], function ($, breakpoints) {

    var module = (function (my) {

        if (!my) {my = {};}

        my.back_to_top = function () {
            var $d  = $(document),
                $w  = $(window),
                $it = $('.js-back-to-top'),
                $b  = $('body'),
                $itw= null,
                $jsContainer = $('.js-plp-container'),
                $fb = $('.js-back-to-top-trigger'),
                documentHeight = $d.height(),
                windowHeight= $w.height(),
                offset      = $it.offset(),
                width       = $it.outerWidth(),
                height      = $it.outerHeight(),
                breakPoint  = 0,
                saveScroll  = null,
                placed      = false;

            $it.wrap('<div />');
            $jsContainer.css('position', 'relative');

            $itw = $it.parent();
            $('.js-back-to-top').click(function () {
                $('html, body').animate({ scrollTop: 0}, 'fast');
            });


            function position() {

                var st = $d.scrollTop();

                // Point where itinerary's bottom is aligned with left hand side content
                var b = (st + height + $(window).height() - 70 );

                // Point where itinerary should snapped to footer
                breakPoint = parseInt($fb.offset().top, 10);

                if ($w.scrollTop() > 500){
                    $it.removeClass('hidden');
                }   else{
                    $it.addClass('hidden');
                }


                // Should the itinerary snapped to the footer?
                if( b >= breakPoint ) {

                    $it.css({
                        width : width
                    }).addClass('snapped');


                }
                else {
                    $it.removeClass('snapped');
                }
            }

            $w.on('scroll', position);

            // Set the position when page is loaded

                position();

        };

        my.init = function () {
            this.back_to_top();
        };

        return my;

    })(module);

    return module;

});
