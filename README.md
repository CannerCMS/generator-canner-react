# generator-canner-react [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Build Status](https://travis-ci.org/Canner/generator-canner-react.svg?branch=master)](https://travis-ci.org/Canner/generator-canner-react)
> A generator for react projects

*Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files.*

That'll generate a project with all the common tools setup. This includes:

- Filled `package.json` file
- [webpack](https://webpack.github.io/) 
- [Babel](https://babeljs.io/) ES2015 transpiler
- [editorconfig](http://editorconfig.org/)
- [mocha](http://mochajs.org/) unit test
- [ESLint](http://eslint.org/) linting and code style checking
- [Istanbul](https://gotwarlost.github.io/istanbul/) code coverage (optionally tracked on [Coveralls](https://coveralls.io/))
- [Travis CI](https://travis-ci.org/) continuous integration (optional)
- [License](https://spdx.org/licenses/)
- README

... and more!

## Tree structure

```
<Project>
	├── webpack.config.dev.js
	├── tests.webpack.js
	├── test
	│   ├── <project>-test.js
	│   └── .eslintrc
	├── src
	│   └── index.js
	├── package.json
	├── lib
	│   └── index.js
	├── karma.conf.js
	├── example
	│   ├── index.js
	│   └── index.html
	├── devServer.js
	├── README.md
	├── .gitignore
	├── .gitattributes
	├── .eslintrc.js
	├── .editorconfig
	└── .babelrc
```


## Installation

First, install [Yeoman](http://yeoman.io) and generator-canner-react using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-canner-react
```

Then generate your new project:

```bash
yo canner-react
```
## Maintainer

[chilijung](https://github.com/chilijung)

## License

MIT © [Canner](https://github.com/canner)


[npm-image]: https://badge.fury.io/js/generator-canner-react.svg
[npm-url]: https://npmjs.org/package/generator-canner-react
[daviddm-image]: https://david-dm.org/canner/generator-canner-react.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/canner/generator-canner-react
