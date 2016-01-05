define(['jquery', 'ko', 'progress'], function ($, ko, progress) {

    var module = (function () {

        var my = {};
        var binded = false;
        var input;
        var inputVal = $('#name-search').val();

        var viewModel = function () {
            var self = this;

            self.suggestions = ko.observableArray([]);
            self.filterText = ko.observable('');

            self.filterText.subscribe(function (newValue) {
            });

            self.suggestionsFilter = ko.computed(function () {

                if (self.filterText() === '') {
                    console.log(self.filterText(), 'stringA' );
                    return self.suggestions();
                } else {
                    console.log(self.filterText(), 'stringB');
                    return ko.utils.arrayFilter(self.suggestions(), function (item) {

                        var filterResults =  ko.utils.stringStartsWith(item.option.toLowerCase(), self.filterText().toLowerCase());
                        console.log(filterResults);
                        return filterResults;

                    });


                }


            });

        };


        my.bindEvents = function () {

            /*  $(input).blur(function() {
             viewModel.suggestions.removeAll();
             });*/


            $.getJSON('data/address-suggestions.json', function (response) {
                $.each(response, function () {
                    this.option = this.option.replace(this.match);
                    vm.suggestions.push(this);
                });

            });

            $('.suggestions li').click(function() {
                $.getJSON('data/suggestions.json', function (response) {
                    $.each(response, function () {
                        this.option = this.option.replace(this.match);
                        vm.suggestions.push(this);
                    });

                });

            });


        };


        my.init = function (_input) {

            if (binded) {
                return;
            }

            binded = true;
            input = _input;

            my.bindEvents();

            // Commented due to conflicts with another KO bind by IT team.
            vm = new viewModel();
            ko.applyBindings(vm, document.getElementById('js-postcode-search-suggestions'));

            progress.done();
        };


        return my;

    }());

    return module;

});