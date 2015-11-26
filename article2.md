Unit Testing and TDD in Node - Part 2
=====================================

In the [last article](https://www.codementor.io/nodejs/tutorial/unit-testing-nodejs-tdd-mocha-sinon), we looked at how to write unit tests using Mocha and Chai using a test driven development (TDD) approach. We also looked at how and when to use test doubles using the Sinon library. Specifically, we used a type of test double called a stub to act as a controllable replacement for the `tax` module since it had not been implemented yet and `CartSummary` depended on it. In this article, we will look at how to write unit tests for that `tax` module that makes an HTTP request. Let's get started!

### Testing HTTP Requests

So you might be wondering how to write units for functions that make HTTP requests. Aren't unit tests supposed to be isolated? Yes, unit tests are supposed to be isolated. Thanks to a library called [Nock](https://github.com/pgte/nock), we can fake out HTTP requests made from Node and return canned responses. In short, Nock is an HTTP mocking library for Node. This library works by overriding Node's `http.request` function so that HTTP requests are not made. Instead, Nock intercepts your HTTP requests and allows you to provide a custom response. Let's see how we can use this to test `tax.calculate`.

First, install Nock:

```
npm install nock --save-dev
```

Nock is not a library you would use in production. It is development tool used for testing, so we save it to our development dependencies. Now, let's write our first test.

```js
// tests/part2/tax-test.js
var nock = require('nock');
// ...
it('calculate() should resolve with an object containing the tax details', function(done) {
  nock('https://some-tax-service.com')
    .post('/request')
    .reply(200, {
      amount: 7
    });

  tax.calculate(500, 'CA', function(taxDetails) {
    expect(taxDetails).to.eql({ amount: 7 });
    done();
  });
});
```

When a POST request is made to https://some-tax-service.com/request, Nock will return the following static JSON response:

```json
{
  "amount": 7
}
```

This static response should mimic what the API would really respond with. Our test is failing because we have no implementation yet. Let's do that:

Install the `request` module, which is used to make HTTP requests:

```
npm install request --save
```

Then add the following:

```js
// src/part2/tax.js
var request = require('request');
module.exports = {
  calculate: function(subtotal, state, done) {
    request.post({
      url: 'https://some-tax-service.com/request',
      method: 'POST',
      json: {}
    }, function(error, response, body) {
      done(body);
    });
  }
};
```

We've written the minimal amount of code to get our test to pass. One issue with this though is that we don't need to pass the subtotal in the request for our test to pass. Let's see how we can capture that in a test.

```js
// tests/part2/tax-test.js
it('calculate() should send the subtotal in the request', function(done) {
  nock('https://some-tax-service.com')
    .post('/request')
    .reply(200, function(uri, requestBody) {
      return {
        amount: JSON.parse(requestBody).subtotal * 0.10
      };
    });

  tax.calculate(100, 'CA', function(taxDetails) {
    expect(taxDetails).to.eql({ amount: 10 });
    done();
  });
});
```

Here we have written a test where instead of specifying a static JSON response, we have specified a function to execute that reads the subtotal from the request and calculates a 10% tax. This function is called with an argument `uri` containing the value `/request` and `requestBody`, which is a JSON string containing the request data. We are assuming CA has a 10% tax rate in our test. Now, our test fails until we send over the subtotal.

```js
// src/part2/tax.js
var request = require('request');

module.exports = {
  calculate: function(subtotal, state, done) {
    request.post({
      url: 'https://some-tax-service.com/request',
      method: 'POST',
      json: {
        subtotal: subtotal // added the subtotal in the request payload
      }
    }, function(error, response, body) {
      done(body);
    });
  }
};
```

Our test passes! Now your client comes to you and says to only call the tax API if the state is CA.  Otherwise, don't charge any tax. Our previous tests already handle the case when the state is CA. Let's write a test to handle when the state is not CA.

```js
// tests/part2/tax-test.js
it('calculate() should not make a request if the state is not CA', function(done) {
  nock('https://some-tax-service.com')
    .post('/request')
    .reply(200, function(uri, requestBody) {
      return {
        amount: JSON.parse(requestBody).subtotal * 0.10
      };
    });

  tax.calculate(100, 'NY', function(taxDetails) {
    expect(taxDetails).to.eql({ amount: 0 });
    done();
  });
});
```

Our test fails. The implementation for this test to pass becomes:

```js
// src/part2/tax.js
module.exports = {
  calculate: function(subtotal, state, done) {
    if (state !== 'CA') {
      done({ amount: 0 });
    }

    request.post({
      url: 'https://some-tax-service.com/request',
      method: 'POST',
      json: {
        subtotal: subtotal
      }
    }, function(error, response, body) {
      done(body);
    });
  }
};
```

### Conclusion

In this post, we looked at how to test modules that make HTTP requests in isolation using a library called Nock. Behind the scenes, Nock overrides Node's `http.request` function which is used by the `request` module. I hope you enjoyed this post. If you have any questions, ask them below or reach me on Twitter [@skaterdav85](https://twitter.com/skaterdav85).

[Source code](https://github.com/skaterdav85/node-testing)
