var gulp        = require('gulp');
var browser     = require('open');
var browserify  = require('browserify');
var clean       = require('gulp-clean');
var gutil       = require('gulp-util');
var buffer      = require('gulp-buffer');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var watch       = require('gulp-watch');
var source      = require('vinyl-source-stream');

var paths       = {
    scripts: ['./index.js','./src/**/*.js']
};

gulp.task('browserify', function () {
    var b = browserify('./index.js');

    b.bundle({ standalone: 'Symposia' })
    .pipe(source('symposia.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));

});

gulp.task('clean', function () {
    return gulp.src('./dist/*.js', { read: false})
    .pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['clean','browserify']);
});

gulp.task('default', ['clean','browserify']);
