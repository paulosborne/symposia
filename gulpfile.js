var gulp        = require('gulp');
var buffer      = require('gulp-buffer');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var source      = require('vinyl-source-stream');

var browserify  = require('browserify');

gulp.task('dist', function () {
    var bundleStream = browserify('./index.js').bundle({
        standalone: 'Symposia'
    });

    bundleStream
    .pipe(source('symposia.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));

});

gulp.task('default', ['dist']);
