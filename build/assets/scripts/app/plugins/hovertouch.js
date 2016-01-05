(function(factory) {
    if(typeof define === 'function' && define.amd) {
        define(['jquery', 'hammerjs'], factory);
    } else {
        factory(jQuery);
    }
}(function($, hammerjs) {

    "use strict";

    var settings = {
        className : 'hover'
    };

    $.hovertouch = (function() {
        return {
            latest : null,
            close : function() {
                $($.hovertouch.latest).removeClass(settings.className);
            }
        };
    })();

    $.fn.hovertouch = function(options) {
        
        var callback = $.noop;

        // Is this a touch device or not
        var touch = "ontouchstart" in window || window.navigator.msPointerEnabled;

        var $d = $('html');

        var move = false;

         if(typeof options === 'object') {
            settings = $.extend(settings, options);
        } else if (typeof options == 'function') {
            callback = options;
        } else {
            if(options === 'remove') {
                removeClass(this, $(this).data('uniqueId'));
            }
        }

        function watch(uniqueId, element) {

            $d.off('click.' + uniqueId).on('click.' + uniqueId, function(event) {

                var $target = $(event.target);

                while($target.length > 0) {
                    if($target.is(element)) {
                        return true;   
                    }
                    $target = $target.parent();
                }

                removeClass(element, uniqueId);

                return true;
            });
        }

        function removeClass(element, uniqueId) {
            // Remove hover class
            $(element).removeClass(settings.className);
                
            // Stop listen for off-element touching
            $d.off('tap.' + uniqueId);

            ariaHidden(element);
        }

        function genUniqueId() {
            var id = parseInt(Math.random() * 10000000);
            return id;
        }

        // Set aria-hidden to false to the element and its descendants
        function ariaVisible(element) {
            $(element).attr('aria-hidden', false).find('*[aria-hidden]').attr('aria-hidden', false);
        }

        // Set aria-hidden to true to the element and its descendants
        function ariaHidden(element) {
            $(element).attr('aria-hidden', true).find('*[aria-hidden]').attr('aria-hidden', true);
        }

        return this.each(function() {

            // Do not create new instances if there is a command
            if(typeof options == 'string') {
                return true;
            }

            var $this = $(this);

            // This element has already been initialized to listen for hovertouch events
            if($this.data('uniqueId') !== undefined) {
                return true;
            }

            var uniqueId = genUniqueId();

            $this.data('uniqueId', uniqueId);

            if(touch) {
                $this.hammer().on('tap.' + uniqueId, function(event) {
                    var element = this;
                    if(move === false) {
                        if(callback.call(this, event) !== false) {
                            $(element).addClass(settings.className);
                            ariaVisible(element);
                            $.hovertouch.latest = element;
                            watch(uniqueId, element);
                        }
                    }
                    move = false;
                }).on('touchmove', function(event) {
                    move = true;
                });
            } else {
                $this.on('mouseover', function() {
                    $(this).addClass(settings.className);
                    ariaVisible(this);
                }).on('mouseleave', function(e) {
                    
                    // Do not trigger close if the triggered element is a dropdown/select. An IE bug fix.
                    if($(e.target).get(0).tagName.toLowerCase() == 'select') {
                        return false;
                    }

                    $(this).removeClass(settings.className);
                    ariaHidden(this);
                });
            }
        });
    };
}));