var request = require('request');

function CartSummary(items) {
	this._items = items;
}

CartSummary.prototype.getSubtotal = function() {
	if (this._items.length) {
		return this._items.reduce(function(subtotal, item) {
			return subtotal += (item.quantity * item.price);
		}, 0);
	}

	return 0;
};

CartSummary.prototype.getTax = function(done) {
	request.post({
		url: 'https://taxrequest.exactor.com/request/json',
		method: 'POST',
		json: {
			subtotal: this.getSubtotal()
		}
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
	    done(body.tax);
	  }
	})
};

module.exports = CartSummary;