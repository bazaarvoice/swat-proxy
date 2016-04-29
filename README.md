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

swat_proxy.start();
```

Run your script as normal: `node do-proxy.js`.

Set up your browser to use a proxy server at `127.0.0.1:8063` and navigate to http://www.homedepot.com/.

View Page Source and see that the JS was inserted before the closing body tag (`</body>`).

Open the developer console to see the message "hello from proxy".


## Contributing

### Start the Proxy locally

```bash
npm start
```

### Run the Tests

```bash
npm run test
```