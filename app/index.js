'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

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
  }];

  this.prompt(prompts, function (props) {
    this.siteName = props.siteName;
    this.author = props.author;

    cb();
  }.bind(this));
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
  this.copy('_gitignore', '.gitignore');
};

DjangoGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

DjangoGenerator.prototype.bin = function bin() {
  this.copy('bin/watchmedo.sh', 'bin/watchmedo.sh');
};

DjangoGenerator.prototype.requirements = function requirements() {
  this.copy('requirements/common', 'requirements/COMMON');
  this.copy('requirements/testing', 'requirements/TESTING');
  this.copy('requirements/development', 'requirements/DEVELOPMENT');
  this.copy('requirements/production', 'requirements/PRODUCTION');
};

DjangoGenerator.prototype.settings = function settings() {
  this.copy('init.py', 'settings/__init__.py');
  this.copy('settings/_common.py', 'settings/common.py');
  this.copy('settings/_testing.py', 'settings/testing.py');
  this.copy('settings/_development.py', 'settings/development.py');
};

DjangoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
  this.copy('init.py', '__init__.py');

  this.copy('_fabfile.py', 'fabfile.py');
  this.copy('_package.json', 'package.json');
};
