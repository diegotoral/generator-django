#!/bin/bash
# Watches the file system for changes of ``*.py`` files and executes the tests
# whenever a file is saved.
watchmedo shell-command --recursive --ignore-directories --patterns="*.py" --wait --command='clear && fab test:integration=0' .
