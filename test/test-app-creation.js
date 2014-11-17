/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var assert = require('assert');
var sinon = require('sinon');

describe('django app generator', function () {
    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname,'temp'), function (err) {
            if (err) {
                return done(err);
            }
            // Copy original settings file
            fs.mkdirSync('settings');
            fs.writeFileSync('settings/common.py', fs.readFileSync('../settings/common.py'));
            this.app = helpers.createGenerator('django:startapp', [
                '../../startapp'
            ]);
            done();
        }.bind(this));
    });

    afterEach(function(done) {
        done();
    });

    describe('file creation', function() {
        it('creates expected files', function (done) {
            var expected = [
                'apps/harlo/__init__.py',
                'apps/harlo/views.py',
                'apps/harlo/tests/unit/tests.py',
                'apps/harlo/tests/integration/tests.py',
            ];

            helpers.mockPrompt(this.app, {
                'appName': 'harlo',
                'install': true,
                'hasModels': false
            });
            this.app.on('end', function() {
                helpers.assertFiles(expected);
                done();
            }).run({}, function(){});
        });

    });

    describe('sub generator calls', function() {
        it('should call model sub method if it has models with a name, several times if needed', function (done) {
            // Stub and make sure it calls back createModels to recreate the loop
            var stub = sinon.stub(this.app, "invoke", this.app.createModels.bind(this.app));
            helpers.mockPrompt(this.app, {
                'appName': 'harlo',
                'install': true,
                'hasModels': true,
                'modelName0': 'Blop',
                'modelName1': 'Lalala'
            });
            this.app.on('end', function() {
                var args = stub.firstCall.args;
                // First arg should be sub generator
                assert.equal(args[0], 'django:model');
                // Next is params, including app name and model name
                assert.equal(JSON.stringify(args[1]), JSON.stringify({ args: [ 'harlo', 'Blop' ] }));
                // Check next call
                args = stub.secondCall.args;
                assert.equal(args[0], 'django:model');
                // Next is params, including app name and model name
                assert.equal(JSON.stringify(args[1]), JSON.stringify({ args: [ 'harlo', 'Lalala' ] }));
                // Should not be called a third time
                assert.equal(stub.callCount, 2);
                done();
            }.bind(this)).run({}, function(){});
        });
    });

    describe('app installation', function() {
        it('should have the correct settings in the end', function (done) {
            helpers.mockPrompt(this.app, {
                'appName': 'harlo',
                'install': true,
                'hasModels': false
            });
            this.app.on('end', function() {
                var outcomeContent = fs.readFileSync('settings/common.py', {encoding: 'utf8'});
                var expectedOutcome = fs.readFileSync('../outcome/settings_after_installation.py', {encoding: 'utf8'});
                assert.equal(outcomeContent, expectedOutcome);
                done();
            }.bind(this)).run({}, function(){});
        });
    });

});
