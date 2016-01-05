/**
 * Factory module for progress bars. Any configuration should be done in this module.
 */
define(['nprogresscore'], function(NProgress) {

	NProgress.configure({
		showSpinner : false
	});

	return NProgress;
});