var requirejs = require('../lib/requirejs.min.js');

console.log(requirejs);

describe('Off canvas component', function() {
	describe('#open()', function() {
		it('should open without error', function() {
			requirejs(['offcanvas'], function(Offcanvas) {
				var offcanvas = new Offcanvas();
				assert.equal(-1, offcanvas.open());
			})
		});
	})
})