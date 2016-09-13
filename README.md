[![Build Status](https://travis-ci.org/bazaarvoice/swat-proxy.svg?branch=master)](https://travis-ci.org/bazaarvoice/swat-proxy)

# swat-proxy

swat-proxy is a tool to easily inject content, such as Javascript web applications,
onto third party web pages. This is useful in the development of applications
intended for third party use. It can also be useful in establishing a general
proxy server for use in applications that might need to regularly transform
requested content.

swat-proxy acts as a man-in-the-middle between browser and server, altering the
server response for specified pages. The browser renders the modified response
as if it came directly from the server itself. This allows viewing and
interacting with content on the target page.

The name swat-proxy derives from the name of the Small Web-Apps Technology team
whose members built the first iteration of this tool.

## Installation

```bash
npm install swat-proxy
```

## Quick Start

### Write a script that runs the Proxy

```js
/* Filename: do-proxy.js */

// Import swat-proxy.
var swat_proxy = require('swat-proxy');

// Add some JS to the end of the Google homepage.
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> alert ("Hello from swat-proxy!"); </script>'
});

// Start the proxy server.
swat_proxy.start();
```

### Run your Script

```bash
node do-proxy.js
```

By default swat-proxy runs on port `8063` so set your browser to use the proxy
at `127.0.0.1:8063` and navigate to `http://www.google.com/`.

You should be immediately presented with the greeting alert, and you can
`View Page Source` to see that the Javascript was inserted before the closing
body tag (`</body>`).

## Usage

Let us dig a little deeper.

### Proxy Blocks

A call to `.proxy` is referred to as a *proxy block*:

```js
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> alert ("Hello from swat-proxy!"); </script>'
});
```

The way to read this proxy block is:

> *APPEND* `content` to the *body* of `http://www.google.com`.

#### Removing Proxy Blocks

In order to prevent memory leaks over the lifetime of potentially long-running
proxy scripts, when new proxy URLs may be registered in an ad hoc fashion, a
`.removeProxy` function is also provided. An example usage might look like this:

```js
var options = {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> alert ("Hello from swat-proxy!"); </script>'
};

swat_proxy.proxy('http://www.google.com/', options);
swat_proxy.removeProxy('http://www.google.com/', options);
// OR
swat_proxy.removeProxy('http://www.google.com/');
```

Note that any options objects passed to `.removeProxy` are compared by reference,
not by value. If you want to remove an options object from your proxy at a future
time, you need to store a reference for it in a variable, to be passed later. If
you simply want to clear all proxies associated with a given URL, you can ignore
the second option and just pass the target URL.

#### Details

Let us break down the parameters of proxy blocks. The most up-to-date
documentation can always be found in the [source code][1], but for convenience
it is detailed here as well. Refer to the following signature:

```js
swat_proxy.proxy(url, {
  selector,
  manipulation,
  content,
  [matchType]
});
```

##### URL

The target URL to inject content into. Example `http://www.google.com/`.

Note that this must match **exactly** to the browser URL - `google.com` will
**not** match `www.google.com`. In other words, if you point your proxy block at
`google.com` but navigate to `www.google.com`, your content will not be injected.

The easiest way to grab your target URL is to navigate to your target page and
copy/paste the URL directly into your proxy block code. For example, typing
`google.com` into Firefox and copy/pasting results in `http://google.com/`. This
is the value you want to use.

##### selector

A CSS selector to target DOM elements. Examples `body`, `div`, `#id`, `.class`.

##### manipulation

`swat-proxy` provides an enumeration of supported DOM manipulations to be used
as values for `manipulation`. They are:

  * `APPEND`: Insert `content` as the last child of each of the selected elements.
  * `PREPEND`: Insert `content` as the first child of each of the selected elements.
  * `REPLACE`: Replace selected elements with `content`.
  * `WRAP`: Wrap selected elements with `content`.

`swat-proxy` uses the `cheerio` package under the hood. For more information on
these manipulations, see the [cheerio documentation][2].

##### content

A string containing the content to inject, or a function that returns a string of
content to be injected. If passing a function, it will receive the original element's
markup for transformation, and is expected to return the transformed markup. Since
content is injected into an HTML page, it is important to wrap the content with the
appropriate HTML tags.

##### matchType

`swat-proxy` also provides an enumeration of matchType algorithms for some flexibility
in the way it matches URLs. For backwards compatibility, this field is optional, and
defaults to `EXACT`. The values in the matchType enumeration are:

  * `DOMAIN`: Match against just the domain portion of the url. This includes subdomain.
  * `EXACT`: Match the url exactly as it's been entered, including query parameters.
  * `PREFIX`: Match the target URL against the beginning of the requested URL (i.e. URL starts with)

The `matchType` option is provided as part of the options object(s) passed to the `.proxy`
function, meaning you can provide a different `matchType` parameter for each rule in the
overall set of options, if you desire different behavior based on the URL stub.

```js
// HTML Markup.
content: '<div id="MyWidget">This is my widget!</div>'

// Some Javascript.
content: '<script> alert ("Hello from my widget!"); </script>'

// A block of CSS.
content: '<style> #MyWidget { font-variant: small-caps; } </style>'
```

###### Using React

[React][3] is currently very popular for building front-end user interfaces.
Here is an example of using React to generate markup to assign to `content`:

```js
/* Filename: MyWidget.js */

module.exports = React.createClass({
  render: function () {
    return (
      <div id="MyWidget">This is my widget!</div>
    );
  }
});
```

```js
/* Filename: main.js */

var MyWidget = require('./MyWidget.js');
const WidgetFactory = React.createFactory(MyWidget);
const widgetContent = ReactDOMServer.renderToStaticMarkup(WidgetFactory());

swat_proxy.proxy(example_url, {
  selector: example_selector,
  manipulation: example_manipulation,
  content: widgetContent
});

```

### Third Party JS Common Use Case

A common use case for third party Javascript applications is for clients or
customers to place on their page (a) a container `<div>` where content should
appear, and (b) a `<script>` tag to load the application that will place content
into the container element.

This can be simulated by injecting more than one piece of content into a page
using `swat-proxy`.

#### Using an Array

Pass an array of manipulation instructions into a single proxy block, like so:

```js
// Import swat-proxy.
var swat_proxy = require('swat-proxy');

// Add a container div and Javascript that populates it to the end of the Google
// homepage.
swat_proxy.proxy('http://www.google.com/', [{
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<div id="MyWidgetContainer"></div>'
}, {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script>document.getElementById("MyWidgetContainer").innerHTML = "Hello from swat-proxy!";</script>'
}]);

// Start the proxy server.
swat_proxy.start();
```

#### Multiple Proxy Blocks

The same result can be achieved using multiple proxy blocks with the same target
URL:

```js
// Import swat-proxy.
var swat_proxy = require('swat-proxy');

// Add a container div to the end of the Google homepage.
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<div id="MyWidgetContainer"></div>'
});

// Add Javascript that populates the container div to the end of the Google
// homepage.
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script>document.getElementById("MyWidgetContainer").innerHTML = "Hello from swat-proxy!";</script>'
});

// Start the proxy server.
swat_proxy.start();
```

## FAQ

**Q:** Why is my content not injected?
**A:** The `.start` function supports a `debugMode` property that can hopefully
help:

```js
// Start the proxy server in debug mode.
swat_proxy.start({ debugMode: true });
```

This will log each request URL from to the console and notify when that URL
matches the URL of any proxy block. If there are no matches, revisit the proxy
block's [url configuration](#url).

---

**Q:** I keep getting `Error: listen EADDRINUSE :::8063`?
**A:** The target port (`8063`) is currently in use, most likely because another
instance of the proxy server is running. Shut down that process and try again.
If another service is using that port, it is possible to instruct `swat-proxy`
to use a different port:

```js
// Start the proxy server on port 8064.
swat_proxy.start({ port: 8064 });
```

---

**Q:** My injection worked yesterday and today it doesn't - I haven't changed
anything!
**A:** Many third parties change their web pages on a frequent basis. Ensure
that the selectors used in code and configuration still exist.

## Contributing

Please refer to the [Contributing Guidelines][4].

[1]: https://github.com/bazaarvoice/swat-proxy/blob/master/src/proxy.js
[2]: https://github.com/cheeriojs/cheerio
[3]: https://facebook.github.io/react/
[4]: .github/CONTRIBUTING.md
