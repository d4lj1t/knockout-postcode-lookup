(function(factory) {
	if(typeof define == 'function' && define.amd) {
		define(['jquery', 'hammerify', 'breakpoints', 'postbox'], factory);
	} else {
		factory(jQuery, hammerify, breakpoints, postbox );
	}
}(function($, hammerify, breakpoints) {

	"use strict";

	$.fn.carousel = function(settings) {

		var options = $.extend({
			infinite : true,
			selectorBelt : '> ul',
			selectorItems : '.item',
			selectorPrev : '.prev',
			selectorNext : '.next',
			animationSpeed : 300,
			batch : 0,
			batches : [], // Allow dynamic batches based on a condition
			classDisabled : 'disabled'
		}, settings);

		var Carousel = function(element) {

			// "Global" pointer to the same object
			var instance = this;

			var controlPrev, controlNext, items, items_all = null, belt, beltOffset = 0, beltOffsetDefault = 0, animating = false, thumbItems, skateboard, textboardIndex, thumbs;

			var itemsWidth = [];

			var position = 0;

			// Actual position without the clonings
			this.getIndex = function() {
				var index = Math.abs(position%items.length);

				if(position < 0) {
					index = items.length - index;
					if(index == items.length) {
						index = 0;
					}
				}

				return index;
			};

			this.moveSkateboard = function() {

				// No skateboard to slide :(
				if(!skateboard) {
					return false;
				}

				var index = this.getIndex();

				skateboard.animate({
					'left' : $(thumbs).eq(index).position().left
				}, options.animationSpeed);
			};

			this.updateTextboard = function() {
				var index = this.getIndex();

				// No textboard
				if(!textboardIndex) {
					return false;
				}

				textboardIndex.html(index+1);
			};

			this.animate = function(offset, callback) {
				animating = true;
				belt.animate({
					'margin-left' : offset,
				}, options.animationSpeed, function() {
					animating = false;
					callback();
				});
			};

			this.moveTo = function(gotoIndex) {

				// Do not allow carousel moving if it is currently under move
				if(animating) {
					return false;
				}

				var index = this.getIndex(),
					offset = 0,
					left2right = index < gotoIndex, i;

				for(i = (left2right ? index : gotoIndex); i < (left2right ? gotoIndex : index); i++) {
					offset += itemsWidth[i];
				}

				beltOffset = left2right ? beltOffset - offset : beltOffset + offset;

				position = Math.abs(left2right ? position + (gotoIndex-index) : position - (index - gotoIndex));

				// Move the skateboard under thumbs as well
				this.moveSkateboard();
				this.updateTextboard();

				this.animate(beltOffset, function() {

					if(options.infinite) {

						var item;

						if(left2right) {

							for(i = 0; i < gotoIndex-index; i++) {
								item = items_all.eq(i);
								belt.append(item);
							}
							items_all = instance.getAllItems();
						} else {

							var items_reverse = items_all.get();

							for(i = gotoIndex; i < index; i++ ) {
								item = items_reverse.pop();
								belt.prepend($(item));
							}

							items_all = instance.getAllItems();
						}

						beltOffset = beltOffsetDefault;
						belt.css('margin-left', beltOffset);
					}
				});

				return true;
			};

			this.movePrev = function() {
				
				// Current position is the first possible one and the option for infinite loop is false
				// Do not allow carousel moving if it is currently under move
				if( (position === 0 && options.infinite === false) ||
					animating )  {
					return false;
				}

				var index = this.getIndex();

				if(this.getBatch()) {
					for(var i = index; i > index - this.getBatch(); i--) {
						beltOffset += itemsWidth[i];
						position--;
					}
				} else {
					beltOffset += itemsWidth[index];
					position--;
				}

				this.moveSkateboard();

				this.animate(beltOffset, function() {
					instance.movePrevNextAnimationFinish(-1);
				});

				return true;
			};

			this.moveNext = function() {
				// Stop carousel if the carousel is not supposed to move infinitely
				// Do not move the carousel if there are no images available
				// Do not allow carousel moving if it is currently under move
				if( (position == items.length-1 && options.infinite === false) || 
					(this.getBatch() && position + this.getBatch() >= items.length) || 
					animating ) {
					return false;
				}

				var index = this.getIndex();

				if(this.getBatch()) {
					for(var i = index; i < index + this.getBatch(); i++) {
						beltOffset -= itemsWidth[i];
						position++;
					}
				} else {
					beltOffset -= itemsWidth[index];
					position++;
				}

				this.moveSkateboard();

				this.animate(beltOffset, function() {
					instance.movePrevNextAnimationFinish(1);
				});

				return true;
			};

			this.getBatch = function() {

				if(options.batches.length > 0) {
					for(var _index in options.batches) {
						var _batch = options.batches[_index];
						if(_batch.test.matches) {
							return _batch.batch;
						}
					}
				}

				if(options.batch) {
					return options.batch;
				}

				return 0;
			};

			this.movePrevNextAnimationFinish = function(direction) {

				if(options.infinite) {

					// Clone the currently moved item and put it at the end of the queue to be ready if customer gets to the end
					var item = $(element).find(options.selectorItems)[direction > 0 ? 'eq' : 'last'](0);
					beltOffset  = direction > 0 ? beltOffset + item.width() : beltOffset - item.width();
					belt[direction > 0 ? 'append' : 'prepend']( item ).css('margin-left', beltOffset);
					items_all = instance.getAllItems();
				}

				this.updateTextboard();
				this.disableArrows();
			};

			this.getAllItems = function() {
				return $(element).find(options.selectorItems);
			};

			this.prepareBelt = function() {

				var beltWidth = 0;

				// Reset offset
				beltOffset = 0;
				position = 0;

				if(!options.infinite) {

					// Set belt width
					items.each(function(index) {
						var width = $(this).outerWidth(true);
						beltWidth += width;
						itemsWidth[index] = width;
					});

					belt.width(beltWidth);
				}

				// If carousel is supposed to be an infnite one, clone original elements left and right
				if(options.infinite) {

					// Remove clones
					if(items_all) {
						items_all.filter('.clone').remove();
					}

					// Clone items and and them at the end of the queue
					items.each(function(index) {
						var clone = $(this).clone();
						clone.addClass('clone');
						belt.append(clone);
						// Use this iteration to calculcate belt offset
						var width = clone.width();
						beltOffset -= width;
						itemsWidth[index] = width;

					});

					// Create new clones in the start of the queue 
					$(items.get().reverse()).each(function() {
						var clone = $(this).clone();
						clone.addClass('clone');
						belt.prepend(clone);
					});

					items_all = this.getAllItems();

					beltWidth = Math.abs( 3 * beltOffset );
					beltOffsetDefault = beltOffset;

					// Move belt to the original position
					belt.css('margin-left', beltOffset).width(beltWidth);
				}
			};

			// Create instances of the elements that are needed
			this.prepareElements = function() {

				controlPrev = typeof options.selectorPrev == 'string' ? $(options.selectorPrev) : options.selectorPrev.call(element);
				controlNext = typeof options.selectorNext == 'string' ? $(options.selectorNext) : options.selectorNext.call(element);

				belt = $(element).find(options.selectorBelt);

				items = $(element).find(options.selectorItems);

				this.prepareBelt();

				if(options.thumbs) {

					// Create thumbs objects
					thumbs = $(options.thumbs).find('.item').each(function(index) {
						// Set the index for later use
						$(this).data('index', index);
					});

					skateboard = $(options.thumbs).find('.skateboard');
					textboardIndex = $(options.thumbs).find('.textboard .index');
				}
			};

			// Attach event listeners
			this.bindEvents = function() {

				var hammerjsOptions = {};

				belt.hammer(hammerjsOptions).bind('swipeleft', function() {
					instance.moveNext();
					return false;
				});

				belt.hammer(hammerjsOptions).bind('swiperight', function() {
					instance.movePrev();
					return false;
				});

				// Prev arrow
				controlPrev.click(function() {
					instance.movePrev();
					return false;
				});

				// Next arrow
				controlNext.click(function() {
					instance.moveNext();
					return false;
				});

				if(thumbs) {
					thumbs.click(function() {
						instance.moveTo($(this).data('index'));
						return false;
					});
				}
				
				// Reset breakpoint components when crossing this breakpoint
				breakpoints.update.md().addListener(function(query) {
					instance.prepareBelt();
				});

				postbox.subscribe(function() {
					instance.prepareBelt();
				}, null, 'tab_opened');
			};

			// Disable arrow(s) if there are no where to go 
			this.disableArrows = function() {
				if(options.infinite === false) {
					controlPrev[(position === 0 ? 'add' : 'remove') + 'Class'](options.classDisabled);
					controlNext[(this.getBatch() && this.getBatch() + position == items.length || this.getBatch() === 0 && position + 1 == items.length ? 'add' : 'remove') + 'Class'](options.classDisabled);
				}
			};

			// Constructor
			this.init = function() {

				this.prepareElements();
				this.bindEvents();
				if(options.infinite === false) {
					this.disableArrows();
				}
			};

			// Invoke constructor
			this.init(element);
		};

		return this.each(function() {
			new Carousel(this);
		});
	};
}));