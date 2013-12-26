# -*- coding: utf-8 -*-

import sys

import django
from path import path


##################################################################
# Application configuration
##################################################################

# The ID of the current site in the django_site database table.
SITE_ID = 1

# Directories
PROJECT_DIR = path(__file__).abspath().realpath().dirname().parent
PROJECT_NAME = PROJECT_DIR.basename()
SITE_DIR = PROJECT_DIR.parent
APPS_DIR = PROJECT_DIR / 'apps'
LIBS_DIR = PROJECT_DIR / 'libs'

# Append directories to sys.path
sys.path.append(SITE_DIR)
sys.path.append(APPS_DIR)
sys.path.append(LIBS_DIR)

# Root URLs module
ROOT_URLCONF = '<%= _.slugify(siteName) %>.urls'

# Secret key
# This is used to provide cryptographic signing, and should be set
# to a unique, unpredictable value.
SECRET_KEY = 'yoursecretkey'

##################################################################
# Language and timezone settings
##################################################################

# Specifies whether Django’s translation system should be enabled.
USE_I18N = True

# Specifies if localized formatting of data will be enabled by
# default or not.
USE_L10N = True

# Specifies if datetimes will be timezone-aware by default or not.
USE_TZ = True

# A string representing the time zone for this installation.
TIME_ZONE = 'America/Chicago'

# A string representing the language code for this installation.
LANGUAGE_CODE = 'en'

##################################################################
# Authentication settings
##################################################################

# The model to use to represent a User.
AUTH_USER_MODEL = 'auth.User'

# The URL where requests are redirected for login.
LOGIN_URL = '/accounts/login/'

# The URL where requests are redirected for logout.
LOGOUT_URL = '/accounts/logout/'

# The URL where requests are redirected after login.
LOGIN_REDIRECT_URL = '/accounts/profile/'

##################################################################
# Middleware settings
##################################################################

# The default number of seconds to cache a page when the caching
# middleware or cache_page() decorator is used.
CACHE_MIDDLEWARE_SECONDS = 5

# The cache key prefix that the cache middleware should use.
CACHE_MIDDLEWARE_KEY_PREFIX = PROJECT_NAME + '_'

# A tuple of middleware classes to use.
MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

##################################################################
# Static settings
##################################################################

# The absolute path to the directory where collectstatic will
# collect static files for deployment.
STATIC_ROOT = ''

# URL to use when referring to static files located in STATIC_ROOT.
STATIC_URL = '/static/'

# Additional locations the staticfiles app will traverse if the
# FileSystemFinder finder is enabled.
STATICFILES_DIRS = (
    PROJECT_DIR / 'static',
)

# The list of finder backends that know how to find static files
# in various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

##################################################################
# Templates settings
##################################################################

# List of locations of the template source files.
TEMPLATE_DIRS = (
    PROJECT_DIR / 'templates',
)

# A tuple of template loader classes, specified as strings.
TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

# A tuple of callables that are used to populate the context in
# RequestContext.
TEMPLATE_CONTEXT_PROCESSORS = (
    'django.core.context_processors.request',
    'django.contrib.auth.context_processors.auth'
)

##################################################################
# Installed apps
##################################################################

EXTERNAL_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Other external apps
)

INTERNAL_APPS = (
    # Application specific apps
)
