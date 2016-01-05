/**
 * contact-us.html
 * whether order no is required
 */
define(['jquery'], function ($) {
    var module = (function(my) {

        if(!my) {my = {};}

        my.contactUs = function() {

            $('#enquiry-nature').change(function () {
                if ($(this).find("option:selected").hasClass('js-required')) {
                    $('.js-order-no-wrapper').removeClass('hidden');
                    if ($('.js-order-no-star').hasClass('hidden')){
                        $('.js-order-no-star').removeClass('hidden');
                        $('.js-order-no').attr('required', 'required');
                    }
                } else if ($(this).find("option:selected").hasClass('js-optional-order-no')){
                    $('.js-order-no-wrapper').removeClass('hidden');
                    $('.js-order-no-star').addClass('hidden');
                    $('.js-order-no').removeAttr('required', 'required');

                    if ($('.js-order-no').hasClass('error')){
                        $('.js-order-no').removeClass('error');
                        $('#order-number-error').hide();
                    }
                } else {
                    $('.js-order-no-wrapper').addClass('hidden');
                }
            });
        };

        my.init = function() {
            this.contactUs();
        };

        return my;

    })(module);

    return module;

});