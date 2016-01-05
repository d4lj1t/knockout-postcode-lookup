var SwatchesToggle = function(containerID) {

	var container = null,
		swatches = null,
		toggled = false;

	var originalToggleBtnString = "";

	this.toggleBtn = null;

	this.visible = function() {
		var sum = 0,
			els = 0,
			rows = 1,
			containerWidth = container.offsetWidth,
			width = 0;

		[].forEach.call(this.getSwatches(), function(swatch) {
			if(rows < 4) {

				var style = swatch.currentStyle || window.getComputedStyle(swatch);

				// Swatch width
				width = (swatch.offsetWidth + parseInt(style.marginRight, 10) + parseInt( style.marginLeft, 10) );
				
				sum += width;

				// If element will fall on a new line
				if(sum > containerWidth) {
					sum = width;
					rows++;
				} 
				// Increase elements as long as the element is not below the fold
				if(rows < 4) {
					els++;
				}
			}
		});

		return els;
	};

	this.toggleBtnClicked = function(val) {

		if(typeof val != 'undefined') {
			toggled = val;
		}

		return toggled;
	};

	this.setToggleBtnText = function(text) {
		this.toggleBtnText.innerHTML = text;
	};

	this.setToggleBtnTextAuto = function() {

		if(this.toggleBtnClicked()) {
			this.setToggleBtnText(this.getToggleBtnTextStringOpened());
		} else {
			this.setToggleBtnText(this.getToggleBtnTextStringClosed());
		}
	};

	this.getToggleBtnTextStringClosed = function() {

		var string = originalToggleBtnString;

		string = string.replace('{0}', this.visible());
		string = string.replace('{1}', this.getSwatches().length);

		return string;
	};

	this.getToggleBtnTextStringOpened = function() {

		var string = originalToggleBtnString;

		string = string.replace('{0}', this.getSwatches().length);
		string = string.replace('{1}', this.getSwatches().length);

		return string;
	};

	this.init = function() {
		
		container 	= typeof containerID === "string" ? document.getElementById(containerID) : containerID;
		swatches 	= container.querySelectorAll('.swatch');

		var type = container.dataset.swatchesType;
		this.toggleBtn = document.getElementById('js-swatches-toggle-btn-' + type);
		this.toggleBtnText = this.toggleBtn.querySelector('.js-text');

		if(typeof this.toggleBtnText.originalTextContent === "undefined") {
			this.toggleBtnText.originalTextContent = this.toggleBtnText.innerHTML;
		}
		originalToggleBtnString = this.toggleBtnText.originalTextContent;

		this.setToggleBtnTextAuto();
		this.displayAuto();
	};

	this.getSwatches = function() {
		return swatches;
	};

	this.mustDisplay = function() {
		var visible_swatches = this.visible(container, this.getSwatches());
		return this.getSwatches().length > visible_swatches;
	};

	this.displayAuto = function() {
		this.toggleBtn.style.display = this.mustDisplay() ? 'block' : 'none';
	};

	this.init();
};