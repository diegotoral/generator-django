'use strict';
var util = require('util');
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');

var foldername = path.basename(process.cwd());

var DjangoModelGenerator = module.exports = function DjangoModelGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.appDir = 'apps/' + args[0];
  this.modelFile = this.appDir + '/models.py';
  this.testFile = this.appDir + '/test_unit.py';
  this.on('end', function () {
  });
  this.model = {
    className: args[1],
    fields: [],
    unicode: 'self.'
  }

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(DjangoModelGenerator, yeoman.generators.Base);

function getType(fullType) {
  return fullType.split( ' - ' )[0];
}


DjangoModelGenerator.prototype.createFile = function createFile() {
    if(fs.existsSync(this.modelFile)){
      this.log('Model file already exists');
    } else {
      this.log('Creating new model file');
      this.copy('models.py', this.modelFile);
    }
    if(fs.existsSync(this.testFile)){
      this.log('Test file already exists');
    } else {
      this.log('Creating new test file');
      this.copy('../../startapp/templates/test_unit.py', this.testFile);
    }
}

DjangoModelGenerator.prototype.unicode = function unicode() {
  var cb = this.async();
  var prompts = [{
    name: 'unicode',
    message: 'Unicode representation [optional]'
  }];
  this.prompt(prompts, function(props) {
    this.model.unicode = props.unicode || 'pass';
    cb();
  }.bind(this));
};

DjangoModelGenerator.prototype.addFields = function addFields() {
  var cb = this.async();
  var that = this;
  function addField(fieldName) {
    var prompts = [{
      name: 'fieldType'+that.fieldCount,
      message: 'Type',
      type: 'list',
      choices: [
        'Text - CharField - VARCHAR',
        'Long text - TextField - TEXT',
        'Slug - SlugField - VARCHAR',
        'Boolean - BooleanField|NullBooleanField - BOOL',
        'Decimal - DecimalField - DECIMAL',
        'Integer - IntegerField - INT',
        'Float - FloatField - FLOAT',
        'File - FileField - VARCHAR',
        'Image - ImageField - VARCHAR',
        'Foreign key - ForeignKey - INT',
        'One to one key - OneToOneField - INT',
        'Many to many - ManyToManyField',
        'Date - DateField - DATE',
        'Date and time - DateTimeField - DATETIME',
        'Time - TimeField - TIME',
      ]
    },
    {
      name: 'nullable'+that.fieldCount,
      message: 'Nullable',
      type: 'confirm',
      default: false
    },
    {
      name: 'defaultValue'+that.fieldCount,
      message: 'Default value',
      default: ''
    },
    {
      name: 'max_length'+that.fieldCount,
      message: 'max_length',
      default: 255,
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['Text', 'File', 'Image', 'Slug'], t);
      }
    },
    // File and image stuff
    {
      name: 'upload_to'+that.fieldCount,
      message: 'upload_to',
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['File', 'Image'], t);
      }
    },
    // Decimal stuff
    {
      name: 'max_digits'+that.fieldCount,
      message: 'max_digits',
      default: 10,
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return t === 'Decimal'
      }
    },
    {
      name: 'decimal_places'+that.fieldCount,
      message: 'decimal_places',
      default: 2,
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return t === 'Decimal'
      }
    },
    // Foreign and one to one keys
    {
      name: 'key_model'+that.fieldCount,
      message: 'Key model',
      default: '',
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['Foreign key', 'One to one key', 'Many to many'], t);
      }
    },
    {
      name: 'related_name'+that.fieldCount,
      message: 'Related name',
      default: '',
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['Foreign key', 'One to one key', 'Many to many'], t);
      }
    },
    {
      name: 'primary_key'+that.fieldCount,
      message: 'Primary key',
      default: false,
      type: 'confirm',
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['One to one key'], t);
      }
    },
    // Date and datetime stuff
    {
      name: 'auto_now'+that.fieldCount,
      message: 'Auto now',
      type: 'confirm',
      default: true,
      when: function(answers) {
        var t = getType(answers['fieldType'+that.fieldCount]);
        return that._.contains(['Date', 'Date and time', 'Time'], t);
      }
    }
    ];
    that.prompt(prompts, function(props) {
      that.fieldCount++;
      // Needed because mock prompts don't work _exactly_ the same way as a real loop
      var p = that._.clone(props);
      p.name = fieldName;
      that.model.fields.push(p);
      that.addFields();
    });
  }

  // Initialize count
  that.fieldCount = that.fieldCount || 0;
  var prompts = [
    {
      name: 'fieldName'+that.fieldCount,
      message: 'Field name [leave blank to pass]'
    },
  ];

  this.prompt(prompts, function (props) {
    var name = 'fieldName'+that.fieldCount;
    if(props[name]) {
      addField(props[name]);
    } else {
      that.model.fields = that._.map(that.model.fields, function(field, index) {
        // Get rid of the index everywhere
        var cleanField = {};
        that._.each(field, function(v, k) {
          var clean = k.replace(index, '');
          cleanField[clean] = v;
        });

        cleanField.fieldType = getType(cleanField.fieldType);
        return cleanField;
      });
      cb();
    }
  }.bind(this));
};

DjangoModelGenerator.prototype._makeField = function _makeField(name, type, params) {
  return name + ' = django.db.models.' + type + '(' + params.join(', ') + ')';
};

DjangoModelGenerator.prototype._null = function _null(field, params) {
  if(field.nullable){
    params.push('null=True');
  }
};

DjangoModelGenerator.prototype._default = function _default(field, params) {
  if(field.default){
    params.push('default='+field.default);
  }
};

// All the helper functions to prepare field string
// TODO Any reason to have them on the prototype?
DjangoModelGenerator.prototype._makeFieldImage = function _makeFieldImage(field) {
  var type = 'ImageField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  params.push('max_length='+field.max_length);
  params.push("upload_to='"+field.upload_to+"'");
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldBoolean = function _makeFieldBoolean(field) {
  var type = field.nullable ? 'NullBooleanField' : 'BooleanField';
  var params = [];
  this._default(field, params);
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldFile = function _makeFieldFile(field) {
  var type = 'FileField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  params.push('max_length='+field.max_length);
  params.push("upload_to='"+field.upload_to+"'");
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldDecimal = function _makeFieldDecimal(field) {
  var type = 'DecimalField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  params.push('max_digits='+field.max_digits);
  params.push('decimal_places='+field.decimal_places);
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldInteger = function _makeFieldInteger(field) {
  var type = 'IntegerField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldFloat = function _makeFieldFloat(field) {
  var type = 'FloatField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldText = function _makeFieldText(field) {
  var type = 'CharField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  params.push('max_length='+field.max_length);
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldSlug = function _makeFieldSlug(field) {
  var type = 'SlugField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  params.push('max_length='+field.max_length);
  return this._makeField(field.name, type, params);
};

// Yewwww naming... SO UGLY
DjangoModelGenerator.prototype['_makeFieldLong text'] = function (field) {
  var type = 'TextField';
  var params = [];
  // Text fields should not be nullable, they should have a default ''
  if(field.default) {
    params.push("default=" + field.default);
  } else {
    params.push("default=''");
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype['_makeFieldForeign key'] = function (field) {
  var type = 'ForeignKey';
  var params = [];
  params.push("'"+field.key_model+"'");
  this._null(field, params);
  this._default(field, params);
  if(field.related_name) {
    params.push("related_name='" + field.related_name + "'");
  }
  return this._makeField(field.name, type, params);
};
DjangoModelGenerator.prototype['_makeFieldMany to many'] = function (field) {
  var type = 'ManyToManyField';
  var params = [];
  params.push("'"+field.key_model+"'");
  this._null(field, params);
  this._default(field, params);
  if(field.related_name) {
    params.push("related_name='" + field.related_name + "'");
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype['_makeFieldOne to one key'] = function (field) {
  var type = 'OneToOneField';
  var params = [];
  params.push("'"+field.key_model+"'");
  this._null(field, params);
  this._default(field, params);
  if(field.related_name) {
    params.push("related_name='" + field.related_name + "'");
  }
  if(field.primary_key) {
    params.push('primary_key=True');
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype['_makeFieldDate and time'] = function (field) {
  var type = 'DateTimeField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  if(field.auto_now) {
    params.push('auto_now=True');
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldDate = function _makeFieldDate(field) {
  var type = 'DateField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  if(field.auto_now) {
    params.push('auto_now=True')
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeFieldTime = function _makeFieldTime(field) {
  var type = 'TimeField';
  var params = [];
  this._null(field, params);
  this._default(field, params);
  if(field.auto_now) {
    params.push('auto_now=True')
  }
  return this._makeField(field.name, type, params);
};

DjangoModelGenerator.prototype._makeModel = function _makeModel(model) {
  // Prepare model fields
  this._.each(model.fields, function(field) {
    field.asString = this['_makeField' + field.fieldType](field);
  }.bind(this));
  var fileContent = this.src.read('_modelClass.js');
  var compiled = this.engine(fileContent, model);
  return compiled;
};


DjangoModelGenerator.prototype.appendModel = function appendModel() {
  var that = this;
  // Append the model to the model file
  var fileContent = this.readFileAsString(this.modelFile);

  fileContent += that._makeModel(that.model);

  this.writeFileFromString(fileContent, this.modelFile);
  this.log('Model ' + that.model.className + ' created');
};

DjangoModelGenerator.prototype.appendUnit = function appendUnit() {
  var that = this;
  // Append the model to the model file
  var fileContent = this.readFileAsString(this.testFile);

  fileContent += that.engine(this.src.read('_modelTest.js'), that.model);

  this.writeFileFromString(fileContent, this.testFile);
  this.log('Model test created');
};
