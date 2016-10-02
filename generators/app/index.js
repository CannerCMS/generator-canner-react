'use strict';
var _ = require('lodash');
var extend = _.merge;
var generators = require('yeoman-generator');
var parseAuthor = require('parse-author');
var githubUsername = require('github-username');
var path = require('path');
var askName = require('inquirer-npm-name');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

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
  },

  initializing: function() {
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
  },

  prompting: {
    askForModuleName: function() {
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
      }, this).then(function(answer) {
        this.props.name = answer.name;
      }.bind(this));
    },

    askFor: function() {
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

      return this.prompt(prompts).then(function(props) {
        this.props = extend(this.props, props);
      }.bind(this));
    },

    askForGithubAccount: function() {
      if (this.options.githubAccount) {
        this.props.githubAccount = this.options.githubAccount;
        return;
      }
      var done = this.async();

      githubUsername(this.props.authorEmail).then(username => {
        this.prompt({
          name: 'githubAccount',
          message: 'GitHub username or organization',
          default: username || ''
        }).then(function(prompt) {
          this.props.githubAccount = prompt.githubAccount;
          done();
        }.bind(this));
      });
    }
  },

  writing: function() {
    // Re-read the content at this point because a composed generator might modify it.
    var currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    var pkg = extend({
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
  },

  default: function() {
    if (this.options.travis) {
      this.composeWith('travis', {
        options: {
          config: {
            script: ['npm run test'],
            before_install: [ // eslint-disable-line
              'export CHROME_BIN=chromium-browser',
              'export DISPLAY=:99.0',
              'sh -e /etc/init.d/xvfb start'
            ]
          }
        }
      }, {
        local: require.resolve('generator-travis/generators/app')
      });
    }

    this.composeWith('canner-react:editorconfig', {}, {
      local: require.resolve('../editorconfig')
    });

    this.composeWith('canner-react:eslint', {
      options: {
        example: this.options.webpackExample
      }
    }, {
      local: require.resolve('../eslint')
    });

    this.composeWith('canner-react:git', {
      options: {
        name: this.props.name,
        githubAccount: this.props.githubAccount
      }
    }, {
      local: require.resolve('../git')
    });

    this.composeWith('canner-react:babel', {
      options: {
        name: this.props.name,
        umd: this.props.umd,
        travis: this.props.travis
      }
    }, {
      local: require.resolve('../babel')
    });

    this.composeWith('canner-react:boilerplate', {
      options: {
        name: this.props.name
      }
    }, {
      local: require.resolve('../boilerplate')
    });

    if (this.options.webpackExample) {
      this.composeWith('canner-react:webpackExample', {
        options: {
          projectRoot: this.options.projectRoot,
          authorName: this.props.authorName
        }
      }, {
        local: require.resolve('../webpackExample')
      });
    }

    if (this.options.license && !this.pkg.license) {
      this.composeWith('license', {
        options: {
          name: this.props.authorName,
          email: this.props.authorEmail,
          website: this.props.authorUrl
        }
      }, {
        local: require.resolve('generator-license/app')
      });
    }

    if (!this.fs.exists(this.destinationPath('README.md'))) {
      this.composeWith('canner-react:readme', {
        options: {
          name: this.props.name,
          description: this.props.description,
          githubAccount: this.props.githubAccount,
          authorName: this.props.authorName,
          authorUrl: this.props.authorUrl,
          travis: this.props.travis,
          coveralls: this.props.includeCoveralls,
          content: this.options.readme,
          example: this.options.webpackExample,
          license: this.options.license
        }
      }, {
        local: require.resolve('../readme')
      });
    }
  },

  installing: function() {
    this.npmInstall();
  }
});
