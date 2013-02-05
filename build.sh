#!/bin/bash

for i in phantomjs grunt-jasmine-task grunt-requirejs; do
    npm list --parseable | grep "node_modules/${i}$" > /dev/null \
        || npm install $i
done

grunt test && exit 0 || exit 1
