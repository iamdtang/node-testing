// var chai = require('chai');
// var nock = require('nock');
// var expect = chai.expect;
// var CartSummary = require('./../src/cart-summary.js');
//
// describe('CartSummary', function() {
// 	it('getSubtotal() should return 0 if no items are passed in', function() {
// 		var cartSummary = new CartSummary([]);
// 		expect(cartSummary.getSubtotal()).to.equal(0);
// 	});
//
// 	it('getSubtotal() should return the sum of the price * quantity for all items', function() {
// 		var cartSummary = new CartSummary([
// 			{
// 				id: 1,
// 				quantity: 4,
// 				price: 50
// 			},
// 			{
// 				id: 2,
// 				quantity: 2,
// 				price: 30
// 			},
// 			{
// 				id: 3,
// 				quantity: 1,
// 				price: 40
// 			}
// 		]);
// 		expect(cartSummary.getSubtotal()).to.equal(300);
// 	});
//
// 	it('getTax() should execute the callback function with the tax amount', function(done) {
// 		nock('https://some-tax-service.com')
// 			.post('/request')
// 			.reply(200, function(uri, requestBody) {
// 				return {
// 					tax: JSON.parse(requestBody).subtotal * 0.10
// 				};
// 			});
//
// 		var cartSummary = new CartSummary([
// 			{
// 				id: 1,
// 				quantity: 4,
// 				price: 50
// 			},
// 			{
// 				id: 2,
// 				quantity: 2,
// 				price: 30
// 			},
// 			{
// 				id: 3,
// 				quantity: 1,
// 				price: 40
// 			}
// 		]);
//
// 		cartSummary.getTax(function(tax) {
// 			expect(tax).to.equal(30);
// 			done();
// 		});
// 	});
// });
