[Mocha](https://mochajs.org/)

### Installation



```
npm install mocha -g
```

### Assertion Libraries

> Mocha allows you to use any assertion library you want, if it throws an error, it will work! This means you can utilize libraries such as should.js, node's regular assert module, or others. The following is a list of known assertion libraries for node and/or the browser:

* should.js
* expect.js
* chai
* better-assert

```
touch package.json
echo {} > package.json
npm install chai --save-dev
```

In this post, we'll be using [Chai](http://chaijs.com/).

Mocha does not have a built in assertion library. There are several options though for both Node and the browser: Chai, should.js, expect.js, and better-assert. A lot of developers seem to choose Chai as the assertion library. Because none of these assertion libraries come with Mocha, this is another thing you will need to load into your setup. Chai comes with 3 different assertion flavors. It has the should style, the expect style, and the assert style. The expect style is similar to Jasmine.

### Running Mocha

> By default, mocha looks for the glob ./test/*.js, so you may want to put your tests in test/ folder.

or

```
mocha tests
```

To have your tests run on file change, simply run:

```
mocha --watch
# or
mocha -w
```

### Shopping Cart getSubtotal() Example

* test getSubtotal()

### Mocking API calls - Shopping Cart getTax() Example

> [Nock](https://github.com/pgte/nock) is an HTTP mocking and expectations library for Node.js. Nock can be used to test modules that perform HTTP requests in isolation.

* test getTax() using nock

```
npm install request --save
npm install nock --save-dev
```

* mention that my example isn't a real example of using Exactor.


* Something with rewire or sinon to illustrate mocking. maybe relayed to discount codes? or make getTax more complicated such that it deserves its own class. Show how it can be mocked using rewire, then show how it can be spied on using sinon. For example, only apply tax if the subtotal is >= $0.50. Mention other complicated logic could be applying tax for certain states.



### Mocking with Sinon

Mocking in JavaScript comes in the form of spies. A spy is a function that replaces a particular function where you want to control its behavior in a test and record how that function is used during the execution of that test. Some of the things you can do with spies include:

See how many times a spy was called
Specify a return value to force your code to go down a certain path
Tell a spy to throw an error
See what arguments a spy was called with
Tell a spy to call the original function (the function it is spying on). By default, a spy will not call the original function.

Sinon breaks up mocking into 3 different groups: spies, stubs, and mocks, each with subtle differences.
