/**
 * current offers image hover
 *
 */
define(['jquery', 'breakpoints'], function ($, breakpoints) {
    var module = (function (my) {

        if (!my) {
            my = {};
        }


        my.currentOffers = function () {


            $('.image-wrapper').mouseover(function () {
                if(breakpoints.update.md().matches) {
                    $(this).find('.hover-text').stop(true, true).slideDown();
                }


            });
            $('.image-wrapper').mouseleave(function () {
                if(breakpoints.update.md().matches) {
                    $(this).find('.hover-text').stop(true, true).slideUp();

                }

            });
        };

        my.init = function () {
            this.currentOffers();
        };

        return my;

    })(module);

    return module;

});