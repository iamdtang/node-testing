Unit Testing in Node - Part 1
=============================

Testing is an important practice in software development to improve software quality. There are many forms of testing; manual testing, acceptance testing, unit testing, and a few others. In this post we are going to look at unit testing in Node using the Mocha test framework. Unit tests typically make up the majority of test suites. Unit tests test small units of code, typically a method or a function, __in isolation__. The key thing to remember is the __in isolation__ aspect.


In this post, we'll start off writing unit tests for a function that simply takes some input, returns some output, and has no dependencies. Then we will look at stubs, a type of test double using the Sinon library.  Let's get started!

### Installing Mocha and Chai

To install Mocha, simply run:

```
npm install mocha -g
```

Unlike other JavaScript testing frameworks like Jasmine and QUnit, Mocha does not come with an assertion library. Instead, Mocha allows you to choose your own. Popular assertion libraries used with Mocha include should.js, expect.js, Chai, and Node's built in `assert` module. In this post, we are going to use Chai.

First, let's create a `package.json` file and install Chai:

```
touch package.json
echo {} > package.json
npm install chai --save-dev
```

Chai comes with three different assertion flavors. It has the `should` style, the `expect` style, and the `assert` style. They all get the job done and choosing one is just a matter of preference in how you want the language of your tests to read. Personally I like the `expect` style so we will be using that.

### Your First Test

For our first example, we will use test driven development (TDD) to create a `CartSummary` constructor function, which will be used to total up items placed in a shopping cart. In short, TDD is the practice of writing tests first before an implementation to drive the design of your code. TDD is practiced in the following steps:

1. Write a test and watch it fail
2. Write the minimal amount of code to make that test pass
3. Repeat

By following this process, you are guaranteed to have tests for your code because you are writing them first. It is not always possible, or it is sometimes very difficult, to write unit tests after the fact. Anyways, enough about TDD, let's see some code!

```js
// tests/cart-summary-test.js
var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var CartSummary = require('./../src/cart-summary.js');

describe('CartSummary', function() {
  it('getSubtotal() should return 0 if no items are passed in', function() {
    var cartSummary = new CartSummary([]);
    expect(cartSummary.getSubtotal()).to.equal(0);
  });
});
```

The `describe` function is used to set up a group of tests with a name. I tend to put the module under test as the name. A test is written using the `it` function. The `it` function is given a description as the first argument of what the module under test should do. The second argument of the `it` function is a function that will contain one or more assertions (also called expectations) using Chai in this example. Our first test simply verifies that the subtotal is 0 if the cart has no items.

To run this test, run `mocha tests --watch` from the root of the project. You should see something like this:

![failing-test-1.png](failing-test-1.png)

Our test is failing because we have not yet implemented `CartSummary`. Let's do that.

```js
// src/cart-summary.js
function CartSummary() {}

CartSummary.prototype.getSubtotal = function() {
  return 0;
};

module.exports = CartSummary;
```

Here we've written the minimal amount of code to make our test pass.

![passing test-1](passing-test-1.png)


Let's move on to our next test.

```js
it('getSubtotal() should return the sum of the price * quantity for all items', function() {
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

  expect(cartSummary.getSubtotal()).to.equal(300);
});
```

![failing-test-2.png](failing-test-2.png)

The failing output shows what value `getSubtotal` returned in red and what value we expected in green. Let's revise `getSubtotal` so our test passes.

```js
// src/cart-summary.js

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
```

### Stubbing with Sinon

Let's say we now want to add tax calculation to `CartSummary` in a `getTax()` method:

```js
CartSummary.prototype.getTax = function(state, done) {
  tax.calculate(this.getSubtotal(), state, function(taxInfo) {
    done(taxInfo.tax);
  });
};
```

The `getTax` method will use another module we will create called `tax` with a `calculate` method that will deal with the intricacies of calculating tax. For now, the `tax` module has not been created. However, we can still finish our `getTax` method as long as we identify a contract for the `tax` module. This contact will state that there should be a module called `tax` with a `calculate` method that takes three arguments: a subtotal, a state, and a callback function that will execute when the tax API request has completed. As mentioned before, unit tests test units in isolation. We want to test our `getTax` method isolated from `tax.calculate`. As long as `tax.calculate` abides by its code contract, or interface, `getTax` should work. So what we can do is fake out `tax.calculate` when testing `getTax` using a stub, a type of test double that acts as a controllable replacement. Test doubles are often compared to stunt doubles, as they replace another object with one for testing purposes, similar to how movie stars are replaced with stunts doubles for dangerous action scenes. We can create this stub using the Sinon library.

To install Sinon, run:

```
npm install sinon --save-dev
```

The firs thing we have to do before we can stub out `tax.calculate` is create that module and method:

```js
// src/tax.js
module.exports = {
  calculate: function() {}
};
```

Now that `tax.calculate` has been created, we can stub it out with a controllable replacement:

```js
// tests/cart-summary-2-test.js
// ...
var tax = require('./../src/tax');

describe('getTax()', function() {
  beforeEach(function() {
    sinon.stub(tax, 'calculate', function(subtotal, state, done) {
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

    cartSummary.getTax('NY', function(tax) {
      expect(tax).to.equal(30);
      done();
    });
  });
});
```

In this example, we are stubbing out, or replacing, `tax.calculate` with a pre-programmed function that simply executes the callback with a static tax. This happens in a `beforeEach` block which executes before every test. After each test, the `afterEach` block is executed which restores the original `tax.calculate`.

Sinon is a very powerful library and offers a lot more than just stubs including spies, mocks, fake servers, and plenty more.

### Conclusion

In this post, we looked at a few practical examples of unit testing in Node using the Mocha testing framework, the Chai assertion library, and Sinon for stubbing. I hope you enjoyed this post. If you have any questions, ask them below or reach me on Twitter [@skaterdav85](https://twitter.com/skaterdav85).

[Source code](https://github.com/skaterdav85/node-testing)