Symposia 
========

[![Build Status](https://travis-ci.org/paulosborne/symposia.svg?branch=master)](https://travis-ci.org/paulosborne/symposia)


### Introduction

Symposia is an application architecture for developing loosely coupled, modular applications. 
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
		 * Update counter when a todo item is added
		 * @param {object} data - payload of received message
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
var TodoCounter = require('./components/TodoApp');
var Symposia = require('symposia')();


Symposia.init({
	'todo-app': TodoApp
});
```
