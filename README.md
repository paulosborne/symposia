Symposia 
========

[![Build Status](https://travis-ci.org/paulosborne/symposia.svg?branch=master)](https://travis-ci.org/paulosborne/symposia)


### Introduction

Symposia is a framework for developing loosely coupled, modular applications.

### Installation

```
npm install symposia
```
### Usage

```
var Symposia = require('symposia);
```

### Anatomy of a Module

```
return function (sandbox) {
	return {
		init: function () {
		},
		destroy: function () {
		}
	};
};
```