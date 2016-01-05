/**
 * Form Validation
 */
define(['jquery', 'jquery_validate', 'utils'], function ($, jquery_validate, utils) {
    var module = (function (my) {

        if (!my) {my = {};}

        my.form_validation = function () {

            /*  $.validator.setDefaults({
             submitHandler: function () {
             alert("submitted!");
             }
             });*/

            $.validator.addMethod(
                'email',
                function(value, element){
                    return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
                },
                __('Please enter a valid email address.')
            );
            
            $.validator.addMethod(
                'phoneUK', 
                function(phone_number, element) {
                    return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}$/);
                },
                __('Please specify a valid phone number')
            );

            $.validator.addMethod(
                "postcodeUK", 
                function(value, element) {
                    return this.optional(element) || /[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}/i.test(value);
                }, 
                __("Please specify a valid Postcode")
            );

            $.validator.addMethod(
                "phoneAus",
                function(a,b){return this.optional(b)||a.length>14&&a.match(/^[0-9]{10}$|^\(0[1-9]{1}\)[0-9]{8}$|^[0-9]{8}$|^[0-9]{4}[ ][0-9]{3}[ ][0-9]{3}$|^\(0[1-9]{1}\)[ ][0-9]{4}[ ][0-9]{4}$|^[0-9]{4}[ ][0-9]{4}$/);},
                __("Please specify a valid mobile number")
            );

            // validate the comment form when it is submitted
            $(".js-form").validate({
                rules: {
                    password_confirm: {
                        required: true,
                        minlength: 5,
                        equalTo: '#new-password-confirm'
                    },
                    new_password_confirm: {
                        required: true,
                        minlength: 5,
                        equalTo: '#new-password'
                    },
                    email_address: {
                        required: true,
                        minlength: 5,
                        email: true

                    },
                    email_address_confirm: {
                        required: true,
                        minlength: 5,
                        equalTo: '#email-address',
                        email: true
                    },
                    phone_number: {
                        required: true,
                        phoneUK: true
                    }, 
                    mobile_number: {
                        required: true,
                        phonenumber: true,
                        maxlength: 20
                    }
                },
                messages: {
                    new_password_confirm: {
                        equalTo: __("Password does not match")
                    },
                    email_address_confirm: {
                        equalTo: __("Email Address does not match")
                    },
                    password_confirm: {
                        equalTo: __("Password does not match")
                    }
                },
                errorPlacement: function (error, element) {
                    //Error placement for post-fixed input fields. e.g. Promo code redeem on Payment & Billing page
                    if (element.siblings('.input-group-btn').length > 0) {
                        element.closest('.form-group').append(error);
                    }
                    else {
                        error.insertAfter(element);
                    }
                }

            });

        };


        /**
         * Show and hide the Password field on Checkout Sign In page. Also control the validation of the password field when visible
         * @param none
         * @return none
         */
        my.showHidePasswordField = function () {
            if ($('.js-password-field').length > 0) {

                var $submitButton = $('#js-signin-submit');				//Form submit button
                var $passwordField = $('.js-password-field');				//Password container
                var $passwordInput = $('#js-login-password');				//Password input field
                var $radioButtons = $('.js-password-radio');				//Have password radio buttons

                $submitButton.prop('disabled', true);						//Disable the submit button

                $radioButtons.change(function () {
                    if (this.value == 'yes') {
                        $passwordField.removeClass('hide');					//Show the password container
                        $passwordInput.rules('add', 'required');			//Make sure this field is validated
                    }
                    else if (this.value == 'no') {

                        $passwordField.addClass('hide');					//Hide the password field
                        $passwordInput.val('').rules('remove', 'required');	//Do not validate the password field and remove the content from the input filed
                    }

                    $submitButton.prop('disabled', false);				//Enable the submit button
                });
            }
        };

        my.init = function () {
            this.form_validation();
            this.showHidePasswordField();
        };

        return my;

    })(module);

    return module;

});
