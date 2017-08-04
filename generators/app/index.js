'use strict';
const _ = require('lodash');
const extend = _.merge;
const Generators = require('yeoman-generator');
const parseAuthor = require('parse-author');
const githubUsername = require('github-username');
const path = require('path');
const chalk = require('chalk');
const askName = require('inquirer-npm-name');

module.exports =  class extends Generators {
  constructor(args, options) {
    super(args, options);
    this.option('travis', {
      type: Boolean,
      required: false,
      defaults: false,
      desc: 'Include travis config'
    });

    this.option('coveralls', {
      type: Boolean,
      required: false,
      desc: 'Include coveralls config'
    });

    this.option('webpackExample', {
      type: Boolean,
      required: false,
      defaults: true,
      desc: 'Example folder with webpack local server and hot-reload'
    });

    this.option('license', {
      type: Boolean,
      required: false,
      defaults: true,
      desc: 'Include a license'
    });

    this.option('name', {
      type: String,
      required: false,
      desc: 'Project name'
    });

    this.option('githubAccount', {
      type: String,
      required: false,
      desc: 'GitHub username or organization'
    });

    this.option('projectRoot', {
      type: String,
      required: false,
      defaults: 'lib',
      desc: 'Relative path to the project code root'
    });

    this.option('umd', {
      type: String,
      required: false,
      defaults: false,
      desc: 'Building umd script'
    });

    this.option('readme', {
      type: String,
      required: false,
      desc: 'Content to insert in the README.md file'
    });
  }

  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Pre set the default props from the information we have at this point
    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      babel: true
    };

    if (_.isObject(this.pkg.author)) {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (_.isString(this.pkg.author)) {
      var info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  _askForModuleName() {
    if (this.pkg.name || this.options.name) {
      this.props.name = this.pkg.name || _.kebabCase(this.options.name);
      return;
    }

    return askName({
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
      filter: _.kebabCase,
      validate: function(str) {
        return str.length > 0;
      }
    }, this).then(answer => {
      this.props.name = answer.name;
    });
  }

  _askFor() {
    var prompts = [{
      name: 'description',
      message: 'Description',
      when: !this.props.description
    }, {
      name: 'homepage',
      message: 'Project homepage url',
      when: !this.props.homepage
    }, {
      name: 'authorName',
      message: 'Author\'s Name',
      when: !this.props.authorName,
      default: this.user.git.name(),
      store: true
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email',
      when: !this.props.authorEmail,
      default: this.user.git.email(),
      store: true
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage',
      when: !this.props.authorUrl,
      store: true
    }, {
      name: 'keywords',
      message: 'Package keywords (comma to split)',
      when: !this.pkg.keywords,
      filter: function(words) {
        return words.split(/\s*,\s*/g);
      }
    }, {
      name: 'includeCoveralls',
      type: 'confirm',
      message: 'Send coverage reports to coveralls',
      when: this.options.coveralls === undefined,
      default: false
    }, {
      name: 'travis',
      type: 'confirm',
      message: 'Add travis badge',
      when: !this.options.travis,
      default: false
    }, {
      name: 'webpackExample',
      type: 'confirm',
      message: 'Build example folder for the project',
      when: this.options.webpackExample,
      default: true,
      store: true
    }, {
      name: 'umd',
      type: 'confirm',
      message: 'Build umd script',
      when: !this.options.umd,
      default: false
    }];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
    });
  }

  _askForGithubAccount() {
    if (this.options.githubAccount) {
      this.props.githubAccount = this.options.githubAccount;
      return Promise.resolve();
    }

    return githubUsername(this.props.authorEmail)
      .then(username => username, () => '')
      .then(username => {
        return this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username
        }).then(prompt => {
          this.props.githubAccount = prompt.githubAccount;
        });
      });
  }

  prompting() {
    return this._askForModuleName()
      .then(this._askFor.bind(this))
      .then(this._askForGithubAccount.bind(this));
  }

  writing() {
    // Re-read the content at this point because a composed generator might modify it.
    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    const pkg = extend({
      name: _.kebabCase(this.props.name),
      version: '0.0.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail,
        url: this.props.authorUrl
      },
      files: [
        'lib'
      ],
      main: 'lib/index.js',
      keywords: []
    }, currentPkg);

    // Combine the keywords
    if (this.props.keywords) {
      pkg.keywords = _.uniq(this.props.keywords.concat(pkg.keywords));
    }

    // Let's extend package.json so we're not overwriting user previous fields
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }

  default() {
    if (this.options.travis) {
      this.composeWith(require.resolve('generator-travis/generators/app'), {
        config: {
          script: ['npm run test'],
          before_install: [ // eslint-disable-line
            'export CHROME_BIN=chromium-browser',
            'export DISPLAY=:99.0',
            'sh -e /etc/init.d/xvfb start'
          ]
        }
      });
    }

    this.composeWith(require.resolve('../editorconfig'));

    this.composeWith(require.resolve('../eslint'), {
      example: this.props.webpackExample
    });

    this.composeWith(require.resolve('../git'), {
      name: this.props.name,
      githubAccount: this.props.githubAccount
    });

    this.composeWith(require.resolve('../babel'), {
      name: this.props.name,
      umd: this.props.umd,
      travis: this.props.travis
    });

    this.composeWith(require.resolve('../boilerplate'), {
      name: this.props.name
    });

    if (this.props.webpackExample) {
      this.composeWith(require.resolve('../webpackExample'), {
        projectRoot: this.options.projectRoot,
        authorName: this.props.authorName
      });
    }

    if (this.options.license && !this.pkg.license) {
      this.composeWith(require.resolve('generator-license/app'), {
        name: this.props.authorName,
        email: this.props.authorEmail,
        website: this.props.authorUrl
      });
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith(require.resolve('../readme'), {
        name: this.props.name,
        description: this.props.description,
        githubAccount: this.props.githubAccount,
        authorName: this.props.authorName,
        authorUrl: this.props.authorUrl,
        travis: this.props.travis,
        coveralls: this.props.includeCoveralls,
        content: this.options.readme,
        example: this.props.webpackExample,
        license: this.options.license
      });
    }
  }

  installing() {
    this.yarnInstall();
  }

  end() {
    this.log('Thanks for using Yeoman.');

    if (this.options.travis) {
      let travisUrl = chalk.cyan(`https://travis-ci.org/profile/${this.props.githubAccount || ''}`);
      this.log(`- Enable Travis integration at ${travisUrl}`);
    }

    if (this.props.includeCoveralls) {
      let coverallsUrl = chalk.cyan('https://coveralls.io/repos/new');
      this.log(`- Enable Coveralls integration at ${coverallsUrl}`);
    }
  }
}
