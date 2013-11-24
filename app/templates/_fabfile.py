# -*- coding: utf-8 -*-

from fabric.api import local


def test(integration=1):
    """
    Execute the tests suite with the correct settings. Accept one
    argument that indicates when execute unit tests or not.

    Usage:
        $ fab test
        $ fab test:integration=0
    """
    command = 'django-admin.py test -v 2 --where=./apps --settings=<%= _.slugify(siteName) %>.settings.testing'

    if int(integration) == 0:
        command += " --exclude='integration_tests' --exclude='jasmine_tests'"

    local(command)
