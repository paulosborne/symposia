var gulp        = require('gulp');
var browserify  = require('browserify');
var clean       = require('gulp-clean');
var gutil       = require('gulp-util');
var mocha       = require('gulp-mocha');
var buffer      = require('gulp-buffer');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var watch       = require('gulp-watch');
var path        = require('path');
var open        = require('open');
var express     = require('express');
var source      = require('vinyl-source-stream');
var port        = 8000;
var servers;

var paths       = {
    scripts: ['src/**','test/**']
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
    return gulp.src('./dist/*.js', { read: false }).pipe(clean());
});

gulp.task('test', function () {
   return gulp.src('test/unit/*.spec.js', { read: false }).pipe(mocha({ reporter: 'dot'}));
});

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['clean','browserify','test']);
});

var createServer = function (port) {
    var p = path.resolve("./");
    var app = express();

    app.use(express.static(p));
    app.listen(port, function () {
        gutil.log("listening on", port);
    });

    return {
        app: app
    };
};

gulp.task("server", function () {
    if (!servers) {
        servers = createServer(port);
    }
    open("http://localhost:"+ port +"/index.html");
});

gulp.task('default', ['clean','browserify']);
