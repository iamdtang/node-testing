// var request = require('request');
//
// module.exports = {
// 	calculate: function(subtotal, done) {
// 		if (subtotal < 0.5) {
// 			done({
// 				tax: 0
// 			});
// 			return;
// 		}
//
// 		request.post({
// 			url: 'https://some-tax-service.com/request',
// 			method: 'POST',
// 			json: {
// 				subtotal: subtotal
// 			}
// 		}, function(error, response, body) {
// 			if (!error && response.statusCode === 200) {
// 		    done(body);
// 		  }
// 		});
// 	}
// };
