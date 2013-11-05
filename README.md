symposia 
========

<img src="https://travis-ci.org/posbo/symposia.png?branch=master">

AMD based JavaScript framework for development of scalable, library agnostic, modular web applications.

### Why?

Symposia is a framework that was created to solve a problem that I faced at work. It has been a great learning exercise and has allowed me to develop a number of loosely coupled, modular applications.

### Usage

Symposia has a few dependencies.

- [Installation](#installation)
- [Dependencies](#dependencies)
- [Modules](#modules)
- [Message Bus](#message-bus)

### Installation

To use symposia in your AMD based application, create a new path entry which points to the in your require configuration file

```javascript
paths: {
  "symposia": 'bower_components/symposia/dist/symposia'
}
```

Then include it in a module definition using:

```javascript
define(function (require) {
  var symposia = require('symposia');
});
```
