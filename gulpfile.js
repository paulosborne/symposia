var browserify  = require('browserify');
var watchify    = require('gulp-watchify');
var streamify   = require('gulp-streamify');
var gulp        = require('gulp');
var path        = require('path');
var clean       = require('gulp-clean');
var gutil       = require('gulp-util');
var mocha       = require('gulp-mocha-phantomjs');
var buffer      = require('gulp-buffer');
var rename      = require('gulp-rename');
var uglify      = require('gulp-uglify');
var express     = require('express');
var source      = require('vinyl-source-stream');
var port        = 8000;
var servers;
var watching    = false;

gulp.task('enable-watch-mode', function () {
    watching = true;
});

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

gulp.task('clean', function () {
    return gulp.src('./dist/*.js', { read: false})
    .pipe(clean());
});

gulp.task('build', watchify(function (watchify) {
    return gulp.src('./src/symposia.js')
    .pipe(watchify({
        watch: watching,
        standalone: 'Symposia'
    }))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./dist'));
}));

gulp.task('test', function () {
    return gulp.src('./test/index.html')
    .pipe(mocha({ reporter: 'nyan', dump: './test.xml' }));
});

var createServer = function (port) {
    var p = path.resolve("./");
    var app = express();

    app.use(express.static(p));
    app.listen(port, function () {
        gutil.log('listening on ', port);
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

gulp.task('default', ['clean','build']);
gulp.task('watchify', ['enable-watch-mode','clean','build']);
