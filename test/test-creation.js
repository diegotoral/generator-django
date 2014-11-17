/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;
var fs = require('fs');
var assert = require('assert');

describe('django generator', function () {
    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
            if (err) {
                return done(err);
            }

            this.app = helpers.createGenerator('django:app', [
                '../../app'
            ]);
            done();
        }.bind(this));
    });

    it('creates expected files', function (done) {
        var expected = [
            // Dot files and others
            '.bowerrc',
            '.jshintrc',
            '.gitignore',
            '.editorconfig',
            'package.json',
            'bower.json',
            'README.md',

            // General Python files
            'urls.py',
            'wsgi.py',
            'manage.py',
            '__init__.py',
            'fabfile.py',

            // Settings files
            'settings/.gitignore',
            'settings/__init__.py',
            'settings/common.py',
            'settings/testing.py',
            'settings/development.py',

            // Bins
            'bin/watchmedo.sh',

            // Requirements files
            'requirements/COMMON',
            'requirements/TESTING',
            'requirements/DEVELOPMENT',
            'requirements/PRODUCTION'
        ];

        helpers.mockPrompt(this.app, {
            'someOption': true
        });
        this.app.options['skip-install'] = true;
        this.app.run({}, function () {
            helpers.assertFiles(expected);
            done();
        });
    });

    describe('django version selection', function() {
        beforeEach(function (done) {
            helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
                if (err) {
                    return done(err);
                }

                this.app = helpers.createGenerator('django:app', [
                    '../../app'
                ]);
                done();
            }.bind(this));
        });

        function testVersion(version, expected, done) {
            expected = 'Django' + expected;
            helpers.mockPrompt(this.app, {
                'djangoVersion': version
            });
            this.app.options['skip-install'] = true;
            this.app.run({}, function () {
                // Open COMMON file
                fs.readFile('requirements/COMMON', {
                    encoding: 'utf8'
                }, function(err, content) {
                    content = content.split('\n');
                    var found = content.indexOf(expected);
                    assert.notEqual(-1, found);
                    done();
                });
            });
        }


        it('puts the correct django version into COMMON for 1.5', function(done){
            testVersion.bind(this)('1.5', '>=1.5,<1.6', done);
        });
        it('puts the correct django version into COMMON for 1.6', function(done){
            testVersion.bind(this)('1.6', '>=1.6,<1.7', done);
        });
        it('puts the correct django version into COMMON for 1.7', function(done){
            testVersion.bind(this)('1.7', '>=1.7,<1.8', done);
        });
    });
});
