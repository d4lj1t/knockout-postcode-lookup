define(['ko'], function(ko) {
	window.postbox = new ko.subscribable();

	return window.postbox;
});