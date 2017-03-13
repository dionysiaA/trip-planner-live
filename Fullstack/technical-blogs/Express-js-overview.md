# Express.js – A Gentle Overview
> Zach Caceres

Express.js is a Javascript library that handles web routing and HTTP requests for web applications.

It builds on the native HTTP library in [node.js]() to allow for a simple, object-oriented approach to routing your web application.

The creators of Express.js describe it as a 'minimalist framework', meaning that Express.js handles a few core tasks well, but does not include many nice-to-have features. Instead, you can enhance your Express.js application with *middleware* downloaded from npm or that you build yourself.

This series has three parts.

First, we'll look at HTTP routing, the problem that Express.js tries to solve.
Second, we'll look at a bare-bones setup and configuration of Express.js.
Third, we'll look at practical routing in Express.js.
Fourth, we'll enter the wonderful world of middleware, to see how Express.js makes adding useful features to your app a breeze.

Let's go!

## HTTP Communication – The Problem
Networking occurs when servers and clients talk to each other.

In computing, a *client* refers to a computer that makes *requests*. A *server* refers to a computer that replies with a *response*. The internet, through [TCP/IP](), is the communication channel that servers and clients use to talk to each other.

> Programmers often refer to servers as the *back-end* and clients as the *front-end* a user's online experience. These are still just servers and clients!

HTTP is a set of guidelines and standards for how this networking can occur. We don't need to know the details. Just remember that below Express' simple API, our applications are using HTTP to wire everything together.

#### Request and Response
After a server is launched it sits there, listening for requests.

If a client sends a request, we set off a loop that's at the core of online networking:

* A client initiates a request
* The server listens and receives the request
* The server processes the request, perhaps validating data or interfacing with a database to craft a response
* The server sends a single response back to the client

This back-and-forth between client and server forms the *request/response cycle*. Every HTTP request follows this cycle.

Note that for any requests there is **one and only one response**. When you visit a modern web page, you'll likely make many requests at once even though the page seems to 'load' only one time.

One response may return the HTML of the page, another might deliver an image or a video, and another might deliver a CSS file necessary for styling the web page.

After the request/response cycle is complete, the client's computer and browser handles the rendering and visualization of the response. For example, the client's browser may display images that were sent by the server.

In short, when you type a URL into your web browser, you are making an HTTP request to a server. The website, files, message, or whatever else you receive is that server's response.

#### What's Inside a Request or Response?
Since HTTP is a set protocol, requests and responses have a predictable format. As we'll soon see, Express.js maps onto this format to make response/request handling a breeze.

An HTTP `request` contains...
* Route – What's our URL? (i.e. http://www.google.com)
* Verb – Is this a GET/POST/DELETE or other request? More on this later.
* Headers – Meta-data about the request.
* Payload – The actual data sent by the request, like a name submitted into a form.

An HTTP `response` contains...
* Status – The [HTTP 'status code']() and standard message of the response i.e. `200 / OK!` People are most familiar with the `404` code, which is what you'll receive if you try to access an invalid URL!
* Headers – Meta-data about the response.
* Body – The data sent back to the client, such as the HTML of a webpage or a file.

If you're a little confused by all this, you're not alone.

#### Routing HTTP In Your Website Or App: A Big Headache
Handling responses and requests on your website or application is no small feat. *Every page and file* on your website must be routed to the user at the appropriate time.

To receive data from the user, your server will need to read the request's payload. You'll need to make sure the proper verb is tied to the right route, so that a GET does not act like a POST. You'll need to send back correct status codes and, of course, make sure any files or other data arrive at the proper time.

Each subpage may also have its own route. For example, www.yoursite.com might offer one response and www.yoursite.com/pictures might offer another.

On a complex website imagine how many routes you would need to create if you had to route the whole site together, piece by piece!

The beauty of Express.js is that it massively simplifies all this routing, leaving you to focus on the overall architecture of your app or website.

In the next part of this series, we'll install and configured Express for our app.

____

## Installing Express.js
To install Express.js, you'll first initialize an npm project in a directory of your choice. Then, create a file where you'll build your app. I'm calling mine `app.js`.

Now, run `npm install --save express` from your favorite command line interface. You'll also need an up-to-date version of Node.js, since Express leverages node's HTTP to work its magic.

Once Express.js is installed, we're ready to start building our app.

#### Require and Instantiate An Express App
First `require` express. This makes the Express module available in your .js file. `require('express')` returns a function that we can invoke to create a new express application instance.

        var express = require('express');
        // makes Express available in your app.

Now, we can invoke express and make our Express application available under the variable name `app`.

        var app = express();
        // Creates an instance of express, which allows us to begin routing.

With Express properly imported and our app instantiated, we're ready to start our server!

        app.listen(3000)
        // Starts up our server on port 3000.

`app.listen(port)` starts up our server, listening on the port that we pass in.

        module.exports = app;
        // Allows other files to access our Express app.

Finally, let's make our app available to other files by putting our app into `module.exports`.

Congratulations, you have launched a web server! Now, let's get it to do something.

____

## Routing in Express.js

Now that our app is set up and configured, let's see how Express.js simplifies our routing.

#### Our First Route

Here's what our app currently looks like.

        var express = require('express'); // makes Express available in your app.
        var app = express();  // Creates an instance of express, which allows us to begin routing.

        app.listen(3000);  // Starts up our server on port 3000.
        module.exports = app;  // Allows other files to access our Express app.


Let's add our first route before we start up our server.

        var express = require('express'); // makes Express available in your app.
        var app = express();  // Creates an instance of express, which allows us to begin routing.

        // OUR NEW ROUTE
        app.get('/', function(request, response, next) {
            response.send(200);
        });

        app.listen(3000);  // Starts up our server on port 3000.
        module.exports = app;  // Allows other files to access our Express app.

What's going on here?

If you recall from our last article, HTTP requests all have a *verb* like GET or POST.

When we create a route in Express, we first specify the **verb** that our HTTP request will use. The `get` in our `app.get` is our verb.

`app.get` is a function and takes in the route we want use as its first argument. In this case, we are routing to '/'.
That means that all GET requests to *localhost:3000* will be handled by this route.

Next we see a **callback function**: `function(request, response, next) { });`

This function is called when the user requests the route. Here's all the action! Let's look at this function more closely.

#### Request & Response
In Express.js, requests and responses are handled through three core objects, typically named `request` and `response` or `req` and `res`. We'll talk about `next` in a moment.

The `request` object contains properties that allow us to access the components of our HTTP *request*.

For example, we can call `request.body` to see the payload of the HTTP request. We could call `request.method` to see if the request was a GET, POST, or other HTTP verb. Or, we could call `request.ip` to see the IP address that's requesting our site. Check out the Express documentation for how to access each of these elements from your `request` object!

Remember, every HTTP request needs one and only one response. Here's where our `response` object comes in.

An HTTP response might send the user a status code, some files, a website, or more!

With our `response` object, we have methods to easily craft a response.

In our example above we call `response.send(200)`. This sends the `200` status code back to the user when they request our site. We can also call methods like `response.render(template, data)` to render an HTML page or `response.redirect(anotherURL)` to send users somewhere else.

As with `request`, just check out the docs for how to get the most our of your `response` object.

#### Next
So what's up with `next`? Next is a callback that we can invoke to tell Express to search for another route that satisfies our request.

For example, let's look at our current route:

        app.get('/', function(request, response, next) {
            response.send(200);
        });

Let's say that if
# ^ Start Here

#### how app.use differs from app.get/app.post/app.put etc.
#### what req, res, and next are / do

In the next part of this series, we'll see how to apply our routes to real-world scenarios, such as when we want to receive data from our users.

___

#### methods vs. URIs
You'll first need to route by *verb*. These are the GET/POST/DELETE methods mentioned earlier that form a core part of the HTTP system.

Here's what our file looks like once we add a route to our main page ('index.html').

        var app = require('express');

        app.get('/', function(req, res, next) {

        });

#### Routing to Sub-Resources (e.g. kittens, kittens/123, kittens/123/friends)


#### URI parameters (e.g. kittens/:id) and how to access them



#### Query strings (e.g. kittens?color=calico) and how to access them


In the next part of this series, we'll see how middleware can simplify our work in Express.js and add many useful new features to our application.

# Express.js – Middleware

#### Using Modular Sub-Routers Created with Express.Router()
After all this, we're encountering a problem: all of our routing is in mixed in with our app configuration.

Everything may work fine, but this makes our app harder to maintain and understand. It would be better if could make our code more modular. In one file, we can handle our configuration. In another, we handle our routing.

Express.js makes this remarkable easy through `Express.Router()`.

`Express.Router()` returns a router object that we can attach routes on to. Then, we just attach the router onto our Express app and *voilá*, our routes are configured.

Let's see how this looks.


#### Request bodies (in JSON or URL-encoded) and how to access them


#### Registering and Using Middleware
Middleware refers to modules that are chained 'between' when your Express app is intantiated and when your server is launched with app.listen(myPortNumber).

**Logging**

**Body parsing**

**Static routing**

#### normal vs. error-handling middleware
Error handling middleware resembles other Express.js middleware, except that its positioning is extremely important.

Error handling middleware must be placed *downstream* from any middleware whose errors you want to log. Don't put it at the top.

To handle errors with next, use next(err). This passes an error down to any *error handling middleware*.

// LOOK UP MORE ABOUT ERROR handling MIDDLEWARE HERE


## Commonly-used middleware (what each is & when you need it — setup is copy-paste)
