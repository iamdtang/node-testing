Unit Testing in Node - Part 2
=============================

### Testing HTTP Requests

The code tested above is straighforward to test because it does not have any external dependencies. `getSubtotal` was simply given some input and returned an output. You're probably saying to yourself: "Most of my code makes database and web service calls. How do I test that?". Let me show you.

Let's say we want our `CartSummary` class to have a method for getting the tax from a subtotal. To calculate the tax, we are going to hit a fictitious API that deals with the intricacies of tax calculation. This API expects a POST request to https://some-tax-service.com/request with a JSON payload containing the subtotal. Now remember, unit tests are supposed to be isolated from database and API calls to ensure speed, predictability, and repeatability. If a unit test really hit an API, then it has an external dependency which makes that test brittle. If the API goes down or we make too many requests in a small time period, our test fails. If the API takes a long time to respond, our tests take longer to run. Instead, we want to simulate the request but not actually make it. As long as our implementation abides by the contract of the API, then our code should work when it hits the API for real. By simulating the API call in our unit test, our test suite is no longer dependent on the API and can execute much more quickly. So how do we unit test a method that makes an API call? Let me introduce [Nock](https://github.com/pgte/nock), an HTTP mocking library for Node. This library overrides Node's `http.request` function so that HTTP requests are not actually made. Let's see how we can use this in our test.

First, install Nock:

```
npm install nock --save-dev
```

Now we are going to use Nock to intercept the HTTP call to the tax API in our test.

```js
// tests/cart-summary-test.js

var nock = require('nock');

// ...

it('getTax() should execute the callback function with the tax amount', function(done) {
  nock('https://some-tax-service.com')
    .post('/request')
    .reply(200, function(uri, requestBody) {
      return {
        tax: JSON.parse(requestBody).subtotal * 0.10
      };
    });

  var cartSummary = new CartSummary([{
    id: 1,
    quantity: 4,
    price: 50
  }, {
    id: 2,
    quantity: 2,
    price: 30
  }, {
    id: 3,
    quantity: 1,
    price: 40
  }]);

  cartSummary.getTax(function(tax) {
    expect(tax).to.equal(30);
    done();
  });
});
```

In this test, when a POST request comes in to https://some-tax-service.com/request, Nock will execute our specified function that responds with a JSON payload that contains the tax, which is 10% of the the subtotal passed in the request payload.

This example also exhibits asynchronous testing. Specifying a parameter in the `it` function (called `done` in this example), Mocha will pass in a function and wait for it to execute before ending the tests. The test will timeout and error if `done` is not invoked within 2000 milliseconds.

Let's write the implementation of `getTax` to make this test pass.

```js
// src/cart-summary.js

CartSummary.prototype.getTax = function(done) {
  request.post({
    url: 'https://some-tax-service.com/request',
    method: 'POST',
    json: {
      subtotal: this.getSubtotal()
    }
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      done(body.tax);
    }
  });
};
```

Here `getTax` uses the `request` library to make a POST request to the tax API with a JSON payload containing the subtotal. When the request completes, the callback function passed to `getTax`, called `done`, will execute with the `tax` property in the JSON response.

### Stubbing with Sinon

Let's say we now want to break out our tax calculation into its own module so that it can be used in other parts of our system. We could simply move the code from `getTax` into its own `tax` module with its own test and call it from `getTax`.

```js
// src/tax.js

var request = require('request');

module.exports = {
  calculate: function(subtotal, done) {
    request.post({
      url: 'https://some-tax-service.com/request',
      method: 'POST',
      json: {
        subtotal: subtotal
      }
    }, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        done(body);
      }
    });
  }
};
```

Here is the test for the new `tax` module.

```js
// tests/tax-test.js

describe('tax', function() {
  it('calculate() should execute the callback function with the tax amount', function(done) {
    nock('https://some-tax-service.com')
      .post('/request')
      .reply(200, function(uri, requestBody) {
        return {
          tax: JSON.parse(requestBody).subtotal * 0.10
        };
      });

    tax.calculate(100, function(taxInfo) {
      expect(taxInfo).to.eql({
        tax: 10
      });
      done();
    });
  });
});
```

Notice that in this test I am using `eql` instead of `equal`. `equal` asserts that the target is strictly equal (using ===) to the value whereas `eql` performs a deep comparison between the target and the value.

Here is our revised `getTax()` method:

```js
CartSummary.prototype.getTax = function(done) {
  tax.calculate(this.getSubtotal(), function(taxInfo) {
    done(taxInfo.tax);
  });
};
```

All tests should be passing. However, the test for `getTax` knows about the implementation of `tax.calculate` because it is using Nock to intercept the HTTP request made to the tax API service. If the implementation of `tax.calculate` changed, such as a different tax API service was used, our test for `getTax` would also need to change. Instead, a better approach would be to fake out `tax.calculate` when testing `getTax` using a stub, a controllable replacement. We can create this stub using the Sinon library.

To install Sinon, run:

```
npm install sinon --save-dev
```

Let's revise the `getTax` test to use a Sinon stub instead of Nock.

```js
// tests/cart-summary-2-test.js

describe('getTax()', function() {
  beforeEach(function() {
    sinon.stub(tax, 'calculate', function(subtotal, done) {
      done({
        tax: 30
      });
    });
  });

  afterEach(function() {
    tax.calculate.restore();
  });

  it('get Tax() should execute the callback function with the tax amount', function(done) {
    var cartSummary = new CartSummary([{
      id: 1,
      quantity: 4,
      price: 50
    }, {
      id: 2,
      quantity: 2,
      price: 30
    }, {
      id: 3,
      quantity: 1,
      price: 40
    }]);

    cartSummary.getTax(function(tax) {
      expect(tax).to.equal(30);
      done();
    });
  });
});
```

In this example, we are stubbing out `tax.calculate` with a pre-programmed replacement function that simply executes the callback with a static tax. This happens in a `beforeEach` block which executes before every test. After each test, the `afterEach` block is excuted which restores the original `tax.calculate`. By writing our test for the refactored `getTax` method using a stub instead of Nock, the test never has to change if the underlying implementation of `tax.calculate` changes. Note that the public interface of `tax.calculate` needs to be kept the same.

Sinon is a very powerful library and offers a lot more than just stubs including spies, mocks, fake servers, and plenty more.

### Conclusion

In this post, we looked at a few practical examples of unit testing in Node using the Mocha testing framework, the Chai assertion library, Nock for HTTP mocking, and Sinon for stubbing. I hope you enjoyed this post. If you have any questions, ask them below or reach me on Twitter [@skaterdav85](https://twitter.com/skaterdav85).

[Source code](https://github.com/skaterdav85/node-testing)
