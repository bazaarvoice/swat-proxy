# Contributing

Thanks for contributing! Here are some basic guidelines:

## Getting Started

  * Make sure you have a [GitHub account](https://github.com/).
  * Fork the repository on GitHub.
  * Pull down the source.
  * Run `npm install`.

## Making Changes

  1. Create a topic branch off of `master`.
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

You'll notice that the GitHub repository does not contain the `dist/` directory. This is created locally on your machine after you `npm install` by running [babel](https://babeljs.io/) on the `src/` directory to transpile the ES6 code in `src/` to ES5 code in `dist/`. This allows us to write code in ES6 now without worrying about it not being fully supported in all node environments.

### Pre-commit Script

There is a pre-commit script that runs the tests and the linter before accepting a commit. If your commit fails either of these, you will have to fix it before being able to commit your changes.

We use [tape](https://github.com/substack/tape) and [ESLint](http://eslint.org/) respectively.

### Run the Tests Manually

```bash
npm run test
```

### Run the Linter Manually

```bash
npm run eslint
```

