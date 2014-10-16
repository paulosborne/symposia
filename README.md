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
var TodoCounter = function (sandbox) {
	return {
		/**
		 * Triggered when module is started
		 */
		init: function () {
			sandbox.subscribe({
				channel: 'todo',
				topic: 'item.added',
				callback: this.onItemAdded.bind(this)
			});
		},
		/**
		 * Triggered when module is stopped, used to clean up UI
		 */
		destroy: function () {
			// logic to cleanup views
		},
		/**
		 * Rotate a document
		 * @param {object} data - payload of received message
		 * @param {number} data.direction - degrees to rotate document
		 */
		onItemAdded: function (data) {
			// logic for updating counter
		}
	};
};

module.exports = TodoCounter;
```
### Usage

```javascript
var TodoApp = require('./components/TodoApp');
var Symposia = require('symposia')();


Symposia.init({
	'todo-app': TodoApp
});
```
