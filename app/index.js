'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var randomString = require('randomstring');
var childProcess = require('child_process');
var chalk = require('chalk');

var foldername = path.basename(process.cwd());


var DjangoGenerator = module.exports = function DjangoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DjangoGenerator, yeoman.generators.Base);


DjangoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [{
    name: 'siteName',
    message: 'Whats the name of the website?',
    default: foldername
  }, {
    name: 'author',
    message: 'Who is the creator?',
    default: 'dummy'
  }, {
    name: 'projectRepo',
    message: 'Whats the repo clone URL?'
  },{
    name: 'djangoVersion',
    message: 'Which version of Django would you like to use?',
    type: 'list',
    choices: ['1.5', '1.6', '1.7'],
    default: 2
  }];

  this.prompt(prompts, function (props) {
    this.siteName = props.siteName;
    this.author = props.author;
    this.projectRepo = props.projectRepo;
    var versionMap = {
        '1.5': '>=1.5,<1.6',
        '1.6': '>=1.6,<1.7',
        '1.7': '>=1.7,<1.8',
    };
    this.djangoVersion = versionMap[props.djangoVersion];

    cb();
  }.bind(this));
};

DjangoGenerator.prototype.createSecret = function createSecret() {
    this.secret = randomString.generate(48);
};

DjangoGenerator.prototype.app = function app() {
  // Apps folder.
  this.mkdir('apps');

  // Settings folder.
  this.mkdir('settings');

  // Requirements folder.
  this.mkdir('requirements');

  // Libs and bins folder.
  this.mkdir('bin');
  this.mkdir('libs');

  // Templates folder.
  this.mkdir('templates');
  this.mkdir('templates/layout');

  // Static files folder.
  this.mkdir('static');
  this.mkdir('static/js');
  this.mkdir('static/css');
  this.mkdir('static/img');
  this.mkdir('static/vendor');
};

DjangoGenerator.prototype.git = function git() {
  this.template('_gitignore', '.gitignore');
};

DjangoGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
};

DjangoGenerator.prototype.bin = function bin() {
  this.copy('bin/watchmedo.sh', 'bin/watchmedo.sh');
};

DjangoGenerator.prototype.requirements = function requirements() {
  this.template('requirements/common', 'requirements/COMMON');
  this.copy('requirements/testing', 'requirements/TESTING');
  this.copy('requirements/development', 'requirements/DEVELOPMENT');
  this.copy('requirements/production', 'requirements/PRODUCTION');
};

DjangoGenerator.prototype.settings = function settings() {
  this.copy('settings/gitignore', 'settings/.gitignore');
  this.copy('init.py', 'settings/__init__.py');
  this.template('settings/_common.py', 'settings/common.py');
  this.template('settings/_testing.py', 'settings/testing.py');
  this.template('settings/_development.py', 'settings/development.py');
};

DjangoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.template('_readme.md', 'README.md');
  this.copy('urls.py', 'urls.py');
  this.copy('_wsgi.py', 'wsgi.py');
  this.copy('manage.py', 'manage.py');
  this.copy('init.py', '__init__.py');
  this.template('_fabfile.py', 'fabfile.py');
  this.template('_package.json', 'package.json');
};

DjangoGenerator.prototype.askRunpip = function askRunpip() {
  var that = this;
  var cb = this.async();

  var choices = ['COMMON', 'DEVELOPMENT', 'PRODUCTION', 'TESTING', "Don't run pip install"];

  var prompts = [{
    name: 'runpip',
    message: 'Run pip install for requirements:',
    type: 'list',
    choices: choices,
    default: 1
  }];

  this.prompt(prompts, function (props) {
    that.runpip = props.runpip === choices[4] ? null : props.runpip;
    // Confirm that user is in virtualenv
    var command = 'python -c "import sys; print hasattr(sys, \'real_prefix\')"';
    childProcess.exec(command, function(err, out){
      // TODO That's a rather dirty string check
      if(out === 'False\n') {
        that.log(chalk.bold.yellow('WARNING - You are not in a virtual environment, it is strongly advised that you activate a virtual environment before continuing'));
        var prompts = [
          {
            name: 'skip',
            message: 'Skip pip install?',
            type: 'confirm',
            default: true
          }
        ];
        that.prompt(prompts, function(props) {
          if(props.skip) {
            that.runpip = null;
          }
          cb();
        });
      } else {
        cb();
      }
    });
  });
};

DjangoGenerator.prototype._runPipInstall = function(requirements, cb) {
  var that = this;
  that.log(chalk.green('Installing requirements for '+this.runpip));
  console.log('I thought we re spying....');
  var commandArgs = ['install', '-r', 'requirements/' + this.runpip];
  var pi = childProcess.spawn( 'pip', commandArgs );
  pi.stdout.on('data', function(data){
    that.log(data.toString('utf-8'));
  });
  pi.on('close', function (code) {
    if (code !== 0) {
      that.log(chalk.bold.red('An error has occured during pip install'));
    }
    cb();
  });
  pi.on('error', cb);
};

DjangoGenerator.prototype.runpip = function runpip() {
  console.log(this.runpip);
  if(this.runpip) {
    var cb = this.async();
    this._runPipInstall(this.runpip, cb);
  }
};

