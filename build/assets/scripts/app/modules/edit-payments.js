/**
 * Edit payment
 * click edit to edit the card
 */
define(['jquery'], function ($) {
    var edit_clicked = false;

    var module = (function (my) {

        if (!my) {my = {};}

        my.edit_payments = function () {
            $('.js-edit-btn').click(function () {
               /* if (edit_clicked == true) {
                    $('.js-form').submit();
                }*/

                if ($(this).hasClass('active') && edit_clicked === false) {
                    edit_clicked = true;

                    $('.js-hidden-content').addClass('hidden');
                    $('.js-edit-btn').prop('disabled', false);
                    $('.js-edit-btn').addClass('active');

                    $('.js-edit-btn').prop('disabled', true);
                    $(this).closest('.edit-card-container').find('.js-hidden-content').removeClass('hidden');

                    var edit_card_position = $(this).closest('.edit-card-container').find('.js-hidden-content').offset().top;
                    $('html, body').animate({ scrollTop: edit_card_position}, 'fast');

                }

            });
            $('.js-update-btn').click(function () {
                if ($(this).closest('.js-form').valid()) {
                    edit_clicked = false;
                    $(this).closest('.js-hidden-content').addClass('hidden');
                    $(this).closest('.edit-card-container').find('.js-edit-btn').addClass('active');
                    $('.js-edit-btn').prop('disabled', false);
                }
            });
        };

        my.init = function () {
            this.edit_payments();
        };

        return my;

    })(module);

    return module;
});
