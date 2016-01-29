/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');

var appName = 'harlo'
describe('django model generator', function () {

    describe('file creation', function() {
        beforeEach(function (done) {
            helpers.testDirectory(path.join(__dirname,'temp'), function (err) {
                if (err) {
                    return done(err);
                }
                // Create folder as if we had used startapp
                fs.mkdir(appName);
                this.app = helpers.createGenerator('django:model', [
                    '../../model'
                ], [appName, 'Wager']);
                done();
            }.bind(this));
        });

        it('creates expected files', function (done) {
            var expected = [
                'apps/'+appName+'/models.py',
                'apps/'+appName+'/tests/unit/tests.py'
            ];
            helpers.mockPrompt(this.app, {});
            this.app.on('end', function() {
                helpers.assertFiles(expected);
                done();
            }).run({}, function(){});
        });

    });

    // choices: [
    //     'Text - CharField - VARCHAR',
    //     'Long text - TextField - TEXT',
    //     'Slug - SlugField - VARCHAR',
    //     'Boolean - BooleanField|NullBooleanField - BOOL',
    //     'Decimal - DecimalField - DECIMAL',
    //     'Integer - IntegerField - INT',
    //     'Float - FloatField - FLOAT',
    //     'File - FileField - VARCHAR',
    //     'Image - ImageField - VARCHAR',
    //     'Foreign key - ForeignKey - INT',
    //     'One to one key - OneToOneField - INT',
    //     'Many to many - ManyToManyField',
    //     'Date - DateField - DATE',
    //     'Date and time - DateTimeField - DATETIME',
    //     'Time - TimeField - TIME',
    //     'URL - URLField - VARCHAR'
    //   ]

    describe('field creation', function() {
        beforeEach(function (done) {
            helpers.testDirectory(path.join(__dirname,'temp'), function (err) {
                if (err) {
                    return done(err);
                }
                // Create folder as if we had used startapp
                fs.mkdir(appName);
                this.wagerApp = helpers.createGenerator('django:model', [
                    '../../model'
                ], [appName, 'Wager']);
                this.tagApp = helpers.createGenerator('django:model', [
                    '../../model'
                ], [appName, 'Tag']);
                done();
            }.bind(this));
        });
        it('should create the correct fields in the model', function (done) {
            helpers.mockPrompt(this.wagerApp, {
                'unicode': 'self.title',
                'fieldName0': 'title',
                'fieldType0': 'Text - CharField - VARCHAR',
                'nullable0': false,
                'max_length0': 250,
                'fieldName1': 'lose_condition',
                'fieldType1': 'Long text - TextField - TEXT',
                'nullable1': false,
                'fieldName2': 'created_date',
                'fieldType2': 'Date and time - DateTimeField - DATETIME',
                'nullable2': false,
                'auto_now2': true,
                'fieldName3': 'published_date',
                'fieldType3': 'Date - DateField - DATE',
                'nullable3': true,
                'auto_now3': false,
                'fieldName4': 'completed_date',
                'fieldType4': 'Time - TimeField - TIME',
                'nullable4': true,
                'auto_now4': false,
                'fieldName5': 'is_free',
                'fieldType5': 'Boolean - BooleanField|NullBooleanField - BOOL',
                'nullable5': false,
                'default5': 'False',
                'fieldName6': 'is_win',
                'fieldType6': 'Boolean - BooleanField|NullBooleanField - BOOL',
                'nullable6': true,
                'fieldName7': 'user',
                'fieldType7': 'Foreign key - ForeignKey - INT',
                'nullable7': false,
                'key_model7': 'django.contrib.auth.models.User',
                'related_name7': 'wagers',
                'fieldName8': 'tags',
                'fieldType8': 'Many to many - ManyToManyField',
                'nullable8': false,
                'key_model8': 'Tag',
                'fieldName9': 'category',
                'fieldType9': 'Integer - IntegerField - INT',
                'nullable9': false,
                'fieldName10': 'choice',
                'fieldType10': 'One to one key - OneToOneField - INT',
                'nullable10': true,
                'primary_key10': true,
                'key_model10': 'events.EventChoice',
                'fieldName11': 'amount',
                'fieldType11': 'Decimal - DecimalField - DECIMAL',
                'nullable11': false,
                'max_digits11': 6,
                'decimal_places11': 3,
                'fieldName12': 'pdf',
                'fieldType12': 'File - FileField - VARCHAR',
                'nullable12': false,
                'max_length12': 199,
                'upload_to12': 'folder',
                'fieldName13': 'ad',
                'fieldType13': 'Image - ImageField - VARCHAR',
                'nullable13': true,
                'max_length13': 100,
                'upload_to13': 'images',
                'fieldName14': 'the_url',
                'fieldType14': 'URL - URLField - VARCHAR',
                'nullable14': false,
                'max_length14': 200,

            });
            this.wagerApp.on('end', function() {
                // Now run the second generator
                helpers.mockPrompt(this.tagApp, {});
                this.tagApp.on('end', function() {
                    var modelContent = fs.readFileSync('apps/' + appName + '/models.py', {encoding: 'utf8'});
                    var expectedContent = fs.readFileSync('../outcome/models.py', {encoding: 'utf8'});
                    assert.equal(modelContent, expectedContent);
                    done();
                }).run({}, function() {});
            }.bind(this)).run({}, function(){});
        });
    });

});
