Symposia 
========

[![Build Status](https://travis-ci.org/paulosborne/symposia.svg?branch=master)](https://travis-ci.org/paulosborne/symposia)


### Introduction

Symposia is an application architecture for developing loosely coupled, modular applications.

### Installation

```
npm install symposia
```
### Usage

```
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