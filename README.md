# generator-django [![Stories in Ready](https://badge.waffle.io/diegotoral/generator-django.png?label=ready&title=Ready)](https://waffle.io/diegotoral/generator-django) [![Build Status](https://secure.travis-ci.org/diegotoral/generator-django.png?branch=master)](https://travis-ci.org/diegotoral/generator-django)

A generator for [Yeoman](http://yeoman.io).


## Getting Started

To install generator-django from npm, run:

```
$ npm install -g generator-django
```

Then make a virtualenv and cd into it:

```
$ virtualenv myproject --no-site-packages
$ cd myproject
```

Finally, make your project directory and initiate the generator:

```
$ mkdir myproject && cd myproject
$ yo django
```

## What do you get?

You get the following directory structure:
```
.
├── apps
├── bin
│   └── watchmedo.sh
├── bower.json
├── fabfile.py
├── __init__.py
├── libs
├── package.json
├── README.md
├── requirements
│   ├── COMMON
│   ├── DEVELOPMENT
│   ├── PRODUCTION
│   └── TESTING
├── settings
│   ├── common.py
│   ├── development.py
│   ├── __init__.py
│   └── testing.py
├── static
│   ├── css
│   ├── img
│   ├── js
│   └── vendor
│       └── bower
└── templates
    └── layout
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/diegotoral/generator-django/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

