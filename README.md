Symposia 
========

<img src="https://travis-ci.org/posbo/symposia.png?branch=master">


### Introduction

Symposia is a framework for developing loosely coupled, modular applications by bringing together a number of design patterns including the Mediator, Observer, Module and Sandbox. It is based on the [Patterns of Large Scale JavaScript Applications](http://addyosmani.com/largescalejavascript/) by Addy Osmani and was created to solve a problem I was having at work.

It contains the following open source libraries in its core.

- [Crossroads](http://millermedeiros.github.io/crossroads.js/) by [Miller Medeiros](https://github.com/millermedeiros)
- [PostalJS](https://github.com/postaljs/postal.js) by [Jim Cowart](https://github.com/ifandelse)

### Installation

Reference Symposia in your RequireJS configuration:

```javascript
paths: {
  "symposia": 'bower_components/symposia/dist/symposia'
}
```

Then simply require it.

```javascript
define(function (require) {
  var symposia = require('symposia');
});
```

### Example Module

```javascript
define(function () {
  return function (sandbox) {
    return {
      init: function () {
        console.log('woohoo!');
      },
      destroy: function () {
      
      }
    }
  }
});
```

### Creating Modules

```javascript
symposia.modules.create({
  'my-module': { creator: MyModule }
});
```

### Subscribing to application events

```javascript
sandbox.subscribe({
  topic    : 'todo.create',
  callback : this.createTodo.bind(this)
});
```

### Publishing an event

```javascript
sandbox.publish({
  topic: 'todo.create',
  data: {
    title : 'my first todo',
    body  : 'this is my first todo' 
  }
});
```



