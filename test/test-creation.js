/*global describe, beforeEach, it*/
'use strict';

var path    = require('path');
var helpers = require('yeoman-generator').test;


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

            // General Python files
            '__init__.py',
            'fabfile.py',

            // Settings files
            'settings/__init__.py',
            'settings/common.py',
            'settings/development.py',

            // Bins
            'bin/watchmedo.sh',

            // Requirements files
            'requirements/COMMON',
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
});
