// var chai = require('chai');
// var nock = require('nock');
// var tax = require('./../src/tax');
// var expect = chai.expect;
//
// describe('tax', function() {
// 	describe('calculate()', function() {
// 		it('should execute the callback function with the tax amount', function(done) {
// 			nock('https://some-tax-service.com')
// 				.post('/request')
// 				.reply(200, function(uri, requestBody) {
// 					return {
// 						tax: JSON.parse(requestBody).subtotal * 0.10
// 					};
// 				});
//
// 			tax.calculate(100, function(taxInfo) {
// 				expect(taxInfo).to.eql({
// 					tax: 10
// 				});
// 				done();
// 			});
// 		});
//
// 		it('should execute the callback with 0 if the subtotal is less than $0.50', function(done) {
// 			nock('https://some-tax-service.com')
// 				.post('/request')
// 				.reply(200, function(uri, requestBody) {
// 					return {
// 						tax: JSON.parse(requestBody).subtotal * 0.10
// 					};
// 				});
//
// 			tax.calculate(0.49, function(taxInfo) {
// 				expect(taxInfo).to.eql({
// 					tax: 0
// 				});
// 				done();
// 			});
// 		});
// 	});
// });
