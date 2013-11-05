symposia 
========

<img src="https://travis-ci.org/posbo/symposia.png?branch=master">

AMD based JavaScript framework for development of scalable, library agnostic, modular web applications.


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
