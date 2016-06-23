# Contributing

Thanks for contributing! Here are some basic guidelines:

## Getting Started

  * Make sure you have a [GitHub account](https://github.com/).
  * Fork the repository on GitHub.
  * Pull down the source.
  * Run `npm install`.

## Making Changes

  1. Create a topic branch from `master`.
    * `git checkout -b my_branch master`.
  2. Make your changes in `src/` files.
    * Follow the JSDoc documentation pattern present in other files.
    * Add tests where appropriate.
    * Make commits of logical units.
      * Reference Issue numbers if appropriate.
  3. Create a Pull Request (PR).
    * Push your changes to a topic branch in your fork of the repository.
    * Create a PR. You may have to click `Compare across Forks` first.
      * Fill in the sections of the Pull Request Template presented.

## Developing

### Post-install Script

You'll notice that the GitHub repository does not contain the `dist/` directory.
This is created locally after running `npm install` by running [babel][1] on the
`src/` directory to transpile the ES6 code in `src/` to ES5 code in `dist/`.
This allows for use of ES6 in all Node.js environments.

### Pre-commit Script

A pre-commit script runs unit tests and the linter before accepting a commit.
If a commit fails either of these, it must be fixed before the changes can be
committed.

For this project, [tape][2] is the test framework and [ESLint][3] is used for
linting.

### Run the Tests Manually

```bash
npm run test
```

### Run the Linter Manually

```bash
npm run eslint
```

[1]: https://babeljs.io/
[2]: https://github.com/substack/tape
[3]: http://eslint.org/
