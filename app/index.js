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
  this.mkdir('libs');
  this.mkdir('bins');

  // Templates folder.
  this.mkdir('templates');
  this.mkdir('templates/layout');

  // Static files folder.
  this.mkdir('static');
  this.mkdir('static/js');
  this.mkdir('static/css');
  this.mkdir('static/img');

  this.copy('_gitignore', '.gitignore');
  this.copy('_bower.json', 'bower.json');
  this.copy('_fabfile.py', 'fabfile.py');
  this.copy('_package.json', 'package.json');
};

DjangoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
