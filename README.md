Symposia 
========

[![Build Status](https://travis-ci.org/paulosborne/symposia.svg?branch=master)](https://travis-ci.org/paulosborne/symposia)


### Introduction

Symposia is a framework for developing loosely coupled, modular applications.

### Installation

```javascript
npm install symposia
```
### Usage

```javascript
var Symposia = require('symposia);
```

### Anatomy of a Module

```javascript
return function (sandbox) {
	return {
		init: function () {
		},
		destroy: function () {
		}
	};
};
```
