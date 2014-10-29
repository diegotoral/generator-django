'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var DjangoAppGenerator = module.exports = function DjangoAppGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DjangoAppGenerator, yeoman.generators.Base);

DjangoAppGenerator.prototype.basicDetails = function basicDetails() {
  var cb = this.async();

  var prompts = [{
    name: 'appName',
    message: 'App name',
    default: ''
  }, {
    name: 'install',
    message: 'Install app in settings?',
    type: 'confirm',
    default: true
  }, {
    name: 'hasModels',
    message: 'Contains models?',
    type: 'confirm',
    default: true
  }];

  this.prompt(prompts, function (props) {
    props.appName = props.appName.toLowerCase();
    this.details = props;
    cb();
  }.bind(this));
};

DjangoAppGenerator.prototype.createFolder = function createFolder() {
    this.log('Create directory ' + this.details.appName + 'in apps');
    this.appDir = 'apps/'+this.details.appName;
    this.mkdir(this.appDir);
    this.log('Create init file');
    this.copy('../../app/templates/init.py', this.appDir + '/__init__.py');
    this.copy('views.py', this.appDir + '/views.py');
    this.copy('test_unit.py', this.appDir + '/test_unit.py');
}

DjangoAppGenerator.prototype.addToSettings = function addToSettings() {
  if(this.details.install) {
    var tabulation = '    ';
    // Read the settings file
    var settingsFile = 'settings/common.py';
    var settingsContent = this.readFileAsString(settingsFile);
    var key = 'INTERNAL_APPS'
    var keyAtIndex = settingsContent.indexOf(key) + key.length;
    var idx = settingsContent.indexOf(')', keyAtIndex) - 1;
    // TODO find a way to find out what tabulation is being used
    var newContent = (settingsContent.slice(0,idx) + ',\n' + tabulation + "'"+this.details.appName+"'" + settingsContent.slice(idx));
    this.writeFileFromString(newContent, settingsFile);
  }
}

DjangoAppGenerator.prototype.createModels = function createModels() {
  // Mostly because of unit tests, incrementing the prompt name
    this.modelCount = this.modelCount || 0;
    var modelKey = 'modelName' + this.modelCount;
    var cb = this.async();
    var modelName;
    var that = this;
    if(this.details.hasModels){
        var prompts = [{
            name: modelKey,
            message: 'Model class [leave blank to pass]',
            default: ''
        }];

        this.prompt(prompts, function (props) {
            if(props[modelKey]) {
              var modelName = props[modelKey];
              that.log('Creating model '+modelName);
              ++that.modelCount;
              that.invoke('django:model', {
                args: [that.details.appName, modelName]
              }, that.createModels.bind(that));
            } else {
                cb();
            }
        }.bind(this));
    } else {
      cb();
    }
}
