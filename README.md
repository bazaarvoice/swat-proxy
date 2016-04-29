# swat-proxy

## Start the Proxy

```bash
npm start
```

## Run the Tests

```bash
npm run test
```

### Failing Tests?

By default the TAP output is run through `faucet` to make it pretty. Unfortunately, `faucet` ignores `console.log` statements that you may have to debug your code.

If you need to debug tests / application code using `console.log` statements, use

```bash
npm run debug
```

This will run the tests but not pipe the output through `faucet`, meaning your `console.log` statements will show up in the output.
