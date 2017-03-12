# How to Eyeball Your ‘This’ Context in Javascript

The early programmer struggles with the Javascript keyword `this`. But understanding your `this` context is easier than it seems.

`This` is all about _where a function is invoked_.
Often, early programmers worry about where the function was declared. Perhaps the function was declared in a specific file or a particular object. Surely this changes it's `this`!

Nope.

To understand `this`, we need to see where it is invoked. Nothing else matters, with one exception which we'll cover in a moment.

First, let’s go through the different ways that `this` can be assigned in Javascript.

### Implicit Binding
Implicit binding occurs when dot notation is used to invoke a function.

For example:

     var MyObject = function (){
       this.name = 'MyObjectName';
       this.myProperty = 'property';
     };

     MyObject.prototype.doStuff = function (action) {
       console.log(this.name + ' is ' + action + '!');
     }

     var obj = new MyObject();

     obj.doStuff('awesome'); // prints 'MyObjectName is awesome!'

In implicit binding, **whatever is to the left of the dot** becomes the context for `this` in the function.

### Explicit Binding
Explicit binding of `this` occurs when [.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call), [.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply), or [.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) are used on a function.

We call these explicit because you are explicitly passing in a `this` context to call() or apply(). We’ll talk bind() in just a moment.

Here's how things look:

#### .call() & .apply()
For .call() we pass in the `this` we'd like to use, along with parameters.

`myFunc.call(thisContext, param1, param2, ... );`

For example, using the object declared above...

      var runner = { name: 'John', myFavoriteActivity: 'running' };
      MyObject.prototype.doStuff.call(runner, runner.myFavoriteActivity); // prints 'John is running!';

Since we have .call, we must ignore what appears before the dot in our function call. We are using MyObject's method and calling it on another `this` context: runner.

.apply() is almost the same, except we must pass in an array of parameters after our `this` context.

`myFunc.apply(thisContext, [param1, param2, ...]);`

> Note: .call() can take a series of parameters as well, but they're just separated by commas.

#### Default Binding
Default binding refers to how `this` is the global context whenever a function is invoked without any of these other rules. If *we aren't using a dot* and *we aren't using call(), apply(), or bind()*, our `this` will be our global object.

Your global context depends on where you're working. If you're in the browser, `this` will be the `window`. When programming in [`strict mode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), the global context is `undefined`.

For example while in Chrome:
    function printMe = function () {
      console.log(this);
    }
    printMe() // prints your 'Window Object' if in the browser!

#### Eyeballing `This`
You'll notice that none of these rules require too much work.

1. Is there a dot? Look to the left. That's `this`.
2. Do you see .call() or .apply()? What's passed in before the first comma? Thats `this`.
3. Does the function stand alone when it's invoked? Then what's your global context? That's `this`.

These three rules-of-thumb point to the most important rule of all: `this` refers to a function's *callsite* (where it is invoked).

#### .bind() – The Exception
Unfortunately, .bind() complicates matters a bit.

When called on a function, .bind() sets a `this` context and returns a **new function** of the same name with a bound `this` context.

For example:

      var sayMyName = function () {
        console.log('My name is ' + this.name);
      };

      var jake = {
        name: 'Jake'
      }

      var sayMyName = sayMyName.bind(jake);
      sayMyName(); // 'My name is Jake'

Now, each time we invoke sayMyName, we will get the context of 'jake', because `this` has been bound to it.

Since bind creates a persistent `this` context, we can't eyeball it. We have to go back and find where `this` is bound.

** Callbacks and `this` **

Callbacks seem to introduce another layer of confusion to `this`, but they don't need to.

      var MyObject = function (){
        this.name = 'MyObjectName';
        this.myProperty = 'property';
      };

      MyObject.prototype.doStuff = function (action) {
        console.log(this.name + ' is ' + action + '!');
      }

      var obj = new MyObject();

      setTimeout(obj.doStuff, 1000, 'awesome'); // prints ' is awesome!' after a 1 second delay.
                       ^ Here's our callback!

If we run the above example, we'll see that this.name isn't defined. We only get `' is awesome!'` in our console.

Why? obj.doStuff has a dot! Isn't it implicitly bound?

When obj.doStuff is passed as the callback to setTimeout, *we don't invoke it*. So even though a function with a dot suggests implicit binding, this is not the function's *callsite*.

Instead, the callsite will be in setTimeout, when obj.doStuff is invoked after the delay. In this different context, this has no .name property.

We can fix our function by using .bind(), which we discussed above.

    var MyObject = function (){
      this.name = 'MyObjectName';
      this.myProperty = 'property';
    };

    MyObject.prototype.doStuff = function (action) {
      console.log(this.name + ' is ' + action + '!');
    }

    var obj = new MyObject();

    setTimeout(obj.doStuff.bind(obj), 1000, 'awesome'); // prints 'MyObjectName is awesome!' after a 1 second delay.

In this case, we are binding our callback to the `this` context of MyObject. When the callback is invoked later, we have carried the proper `this` context with it.

Our function now works properly.

In sum: When in doubt, **look at the callsite**!
