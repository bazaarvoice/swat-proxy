# swat-proxy

swat-proxy is intended to be used as a local development helper tool to easily inject content onto third party web pages.

It acts as a man-in-the-middle between your browser (client) and a server, altering the server response for pages you specify. Your browser is none-the-wiser, rendering the response as if it came directly from the server itself.

This allows you to see exactly what your content would look like on the target page.

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

By default swat-proxy runs on port `8063` so set your browser to use the proxy at `127.0.0.1:8063` and navigate to http://www.google.com/.

You should be immediately presented with the greeting alert, and you can `View Page Source` to see that the JS was inserted before the closing body tag (`</body>`).

## Usage

Let's dig a little deeper.

### Proxy Blocks

A call to `.proxy` is affectionately referred to as a *proxy block*:

```js
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> alert ("Hello from swat-proxy!"); </script>'
});
```

The way to read this proxy block is:

> *APPEND* `content` to the *body* of `http://www.google.com`.

#### Details

Let's break down the parameters of proxy blocks. The most up-to-date documentation can always be found in the [source code](https://github.com/bazaarvoice/swat-proxy/blob/master/src/proxy.js#L20), but for convenience it is detailed here too. Refer to the following signature:

```js
swat_proxy.proxy(url, {
  selector,
  manipulation,
  content
});
```

##### url

The target URL to inject content into. Example `http://www.google.com/`.

Note that this must match **exactly** to the browser URL - `google.com` will **not** match `www.google.com`. In other words, if you point your proxy block at `google.com` but navigate to `www.google.com`, your content will not be injected.

The easiest way to grab your target URL is to navigate to your target page and copy/paste the URL directly into your proxy block code. For example, typing `google.com` into Firefox and copy/pasting results in `http://google.com/`. This is the value you want to use.

##### selector

A CSS selector to target DOM elements. Examples `body`, `div`, `#id`, `.class`.

##### manipulation

`swat-proxy` provides an enumeration of supported DOM manipulations to be used as values for `manipulation`. They are:
  * `APPEND`: Insert `content` as the last child of each of the selected elements.
  * `PREPEND`: Insert `content` as the first child of each of the selected elements.
  * `REPLACE`: Replace selected elements with `content`.
  * `WRAP`: Wrap selected elements with `content`.

For more information on these manipulations, see https://github.com/cheeriojs/cheerio#manipulation.

##### content

A string containing the content to inject. Since you're injecting into an HTML page, be sure to wrap your content in appropriate HTML tags.

```js
// HTML Markup.
content: '<div id="MyWidget">This is my widget!</div>'

// Some Javascript.
content: '<script> alert ("Hello from my widget!"); </script>'

// A block of CSS.
content: '<style> #MyWidget { font-variant: small-caps; } </style>'
```

###### Using React

[React](https://facebook.github.io/react/) is currently very popular for building front-end user interfaces. Here is an example of using React to generate some markup to use as `content`:

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

Often times in third party javascript applications we ask clients or customers to put a container `<div>` on their page where they want our widget to appear, and a `<script>` tag to fill it with content.

You can simulate this by injecting more than one piece of content into a page.

#### Using an Array

You can simply pass an array of manipulation instructions into a single proxy block, like so:

```js
// Import swat-proxy.
var swat_proxy = require('./index.js');

// Add a container div and some JS that populates it to the end of the Google homepage.
swat_proxy.proxy('http://www.google.com/', [{
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<div id="MyWidgetContainer"></div>'
}, {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> document.getElementById("MyWidgetContainer").innerHTML = "Hello from swat-proxy!"; </script>'
}]);

// Start the proxy server.
swat_proxy.start();
```

#### Multiple Proxy Blocks

You can also simply write multiple proxy blocks with the same target URL. This behaves the same way as using an array in the previous section.

```js
// Import swat-proxy.
var swat_proxy = require('./index.js');

// Add a container div to the end of the Google homepage.
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<div id="MyWidgetContainer"></div>'
});

// Add some JS that populates the container div to the end of the Google homepage.
swat_proxy.proxy('http://www.google.com/', {
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script> document.getElementById("MyWidgetContainer").innerHTML = "Hello from swat-proxy!"; </script>'
});

// Start the proxy server.
swat_proxy.start();
```

## FAQ

**Q:** Why is my content not being injected?  
**A:** The `.start` function supports a `debugMode` property that can hopefully help you out:

```js
// Start the proxy server in debug mode.
swat_proxy.start({ debugMode: true });
```

This will log each request URL from your browser to the console and inform when that URL matches the URL of any proxy block. If you don't see any matches, revisit your proxy block's [url](#url).

---

**Q:** I keep getting `Error: listen EADDRINUSE :::8063`?  
**A:** That means your target port (`8063`) is currently in use. Likely, this is another instance of the proxy server. Simply shut down that process and try again. If some other service is using that port however, you may need to tell `swat-proxy` to use a different port:

```js
// Start the proxy server on port 8064.
swat_proxy.start({ port: 8064 });
```

---

**Q:** My injection worked yesterday and today it doesn't - I haven't changed anything!  
**A:** tl;dr - Third parties change their web pages. Ensure your selectors still exist!  
This one actually bit me too. I spent about an hour debugging this code and the script I was working on to no avail - my content simply would not show up on the page. Turns out the `div` I was targeting by `id` had been removed from the page by the client I was using for testing.

## Contributing

Please refer to the [Contributing Guidelines](./.github/CONTRIBUTING.md).
