# swat-proxy

## Usage

### Installation

Include the following under the `dependencies` or `devDependencies` section in your `package.json`:

```js
"swat-proxy": "git+ssh://git@github.com:bazaarvoice/swat-proxy.git"
```

Be sure to install to your project:

```bash
npm install
```

### Write a Script that runs the Proxy

```js
/* Filename: do-proxy.js */

import swat_proxy from 'swat-proxy';

// Add some JS to the end of Home Depot's homepage:
swat_proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script>console.log("hello from proxy");</script>'
});

// Start the proxy server.
swat_proxy.start();
```

Run your script as normal: `node do-proxy.js`.

Set up your browser to use a proxy server at `127.0.0.1:8063` and navigate to http://www.homedepot.com/.

View Page Source and see that the JS was inserted before the closing body tag (`</body>`).

Open the developer console to see the message "hello from proxy".

### BV Common Use Case

Often times in SWAT applications we ask clients to put a container `<div>` on their page where they want our module to appear, and a `<script>` tag later on that loads the module into the container.

You can inject more than one piece of content into a page by calling `proxy` multiple times, like so:

```js
import swat_proxy from 'swat-proxy';

// Add the container div to the designated area.
swat_proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: '#BVContentArea',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<div id="BVModuleNameContainer"></div>'
});

// Add the JS that populates the div to the end of the body.
swat_proxy.proxy({
  targets: [
    'http://homedepot.com/',
    'http://www.homedepot.com/'
  ],
  selector: 'body',
  manipulation: swat_proxy.Manipulations.APPEND,
  content: '<script>document.getElementById("BVModuleNameContainer").innerHTML = "hello from BV!";</script>'
});

// Start the proxy server.
swat_proxy.start();
```

*Note:* Order is preserved when injecting content. In other words, proxy your container `div` before referencing it in `script`s.

### Manipulations

`swat-proxy` provides an enumeration of supported DOM manipulations. They are:
  * APPEND: Insert content as the last child of each of the selected elements.
  * PREPEND: Insert content as the first child of each of the selected elements.
  * REPLACE: Replace selected elements with content.
  * WRAP: Wrap selected elements with content.

For more information on these manipulations, see https://github.com/cheeriojs/cheerio#manipulation.

## Contributing

### Start the Proxy locally

```bash
npm start
```

### Run the Tests

```bash
npm run test
```