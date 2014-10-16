Symposia 
========

[![Build Status](https://travis-ci.org/paulosborne/symposia.svg?branch=master)](https://travis-ci.org/paulosborne/symposia)


### Introduction

Symposia is a framework for developing loosely coupled, modular applications. It's library agnostic, giving you the freedom to use something like Backbone for your data store, or React for your view layer. It is work in progress and there may be breaking  changes.

### Installation

```javascript
npm install symposia
```

### Anatomy of a Module

```javascript
var TodoApp = function (sandbox) {
	return {
		init: function () {
		},
		destroy: function () {
		}
	};
};

module.exports = TodoApp;
```
### Usage

```javascript
var TodoApp = require('./components/TodoApp');
var Symposia = require('symposia')();


Symposia.init({
	'todo-app': TodoApp
});
```
