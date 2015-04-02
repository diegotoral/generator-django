# generator-django [![Stories in Ready](https://badge.waffle.io/diegotoral/generator-django.png?label=ready&title=Ready)](https://waffle.io/diegotoral/generator-django) [![Build Status](https://secure.travis-ci.org/diegotoral/generator-django.png?branch=master)](https://travis-ci.org/diegotoral/generator-django) [![NPM version](https://badge.fury.io/js/generator-django.png)](http://badge.fury.io/js/generator-django)

A generator for [Yeoman](http://yeoman.io).


## Demo

A demo application can be found [here](https://github.com/diegotoral/generator-django-demo).

## Getting Started

To install generator-django from npm, run:

```
$ npm install -g generator-django
```

Then make a virtualenv and activate it:

```
$ virtualenv myproject --no-site-packages
$ source myproject/bin/activate
```

Finally, make your project directory and initiate the generator:

```
$ mkdir myproject && cd myproject
$ yo django
```


## Generators

Available generators:

* django
* startapp
* model

**Note: Generators are to be run from the root directory of your app.**

### Django

Sets up a new Django project.

Example:
```sh
$ yo django
```

### Startapp

Sets up an app folder.

Example:
```sh
$ yo django:startapp
```

### Model

Generates a Django model for you.

Example:
```sh
$ yo django:model
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


## Contributing

1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/diegotoral/generator-django/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

