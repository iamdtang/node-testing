var chai = require('chai');
var nock = require('nock');
var expect = chai.expect;
var CartSummary = require('./../src/cart-summary.js');

describe('CartSummary', function() {
	describe('getSubtotal()', function() {
		it('should return 0 if no items are passed in', function() {
			var cartSummary = new CartSummary([]);
			expect(cartSummary.getSubtotal()).to.equal(0);
		});

		it('should return the sum of the prices of the items passed in', function() {
			var cartSummary = new CartSummary([
				{
					id: 1,
					quantity: 4,
					price: 50
				},
				{
					id: 2,
					quantity: 2,
					price: 30
				},
				{
					id: 3,
					quantity: 1,
					price: 40
				}
			]);
			expect(cartSummary.getSubtotal()).to.equal(300);
		});
	});
	
	describe('getTax()', function() {
		it('should return ', function(done) {
			nock('https://taxrequest.exactor.com')
				.post('/request/json')
				.reply(200, function(uri, requestBody) {
					return {
						tax: requestBody.subtotal * 0.10
					};
				});

			var cartSummary = new CartSummary([
				{
					id: 1,
					quantity: 4,
					price: 50
				},
				{
					id: 2,
					quantity: 2,
					price: 30
				},
				{
					id: 3,
					quantity: 1,
					price: 40
				}
			]);

			cartSummary.getTax(function(tax) {
				expect(tax).to.equal(30);
				done();
			});
		});
	});
});