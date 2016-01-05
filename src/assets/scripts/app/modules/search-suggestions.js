define(['jquery', 'ko', 'progress'], function($, ko, progress) {

	var module = (function() {

		var my = {};
		var binded = false;
		var input;
		var viewModel = {
			suggestions : ko.observableArray([])
		};
		var close_btn = $('.quick-search-mobile .js-icon-close');

		my.bindEvents = function() {

			$(input).blur(function() {
				viewModel.suggestions.removeAll();

				close_btn.hide();
			});

			$(input).keyup(function() {

				close_btn.show();

				if($(input).val() === "") {
					viewModel.suggestions.removeAll();
					return;
				}

				$.getJSON('data/suggestions.json', function(response) {
					$.each(response, function() {
						this.option = this.option.replace(this.match, '<strong>' + this.match + '</strong>');
						viewModel.suggestions.push(this);
					});
				});
			});

			close_btn.on('touchstart click', function() {

				$('.js-show-search-box').trigger('touchstart');

				return false;
			});
		};

		my.initMobile = function() {

			$('#js-quick-search-suggestions-mobile').append( $('#js-quick-search-suggestions') );
		};

		my.init = function(_input) {

			if(binded) {
				return;
			}

			binded = true;
			input = _input;

			my.bindEvents();

			// Commented due to conflicts with another KO bind by IT team.
			//ko.applyBindings(viewModel, document.getElementById('js-quick-search-suggestions'));

			progress.done();
		};


		return my;

	}());

	return module;

});