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

In this post, we'll be using Chai.

### Running Mocha

By default, mocha looks for the glob ./test/*.js, so you may want to put your tests in test/ folder.

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

### Shopping Cart getTax() Example

* test getTax() using nock

```
npm install request --save
npm install nock --save-dev
```


