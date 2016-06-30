'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');

gulp.task('js-clean', function() {
  return del('dist/js/**/*');
});
gulp.task('clean-all', function(callback) {
  return runSequence(['js-clean'], callback);
});

gulp.task('js-dist', function() {
  return gulp.src('src/js/*.js')
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe(gulp.dest('dist/js/node'))
  .pipe($.uglify())
  .pipe(gulp.dest('dist/js/node/min'));
});
gulp.task('js-dist-lib', function() {
  return gulp.src('src/js/lib/*.js')
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe(gulp.dest('dist/js/node/lib'))
  .pipe($.uglify())
  .pipe(gulp.dest('dist/js/node/min/lib'));
});
gulp.task('js-dist-param', function() {
  return gulp.src('src/js/param/*.js')
  .pipe(gulp.dest('dist/js/node/param'))
  .pipe($.uglify())
  .pipe(gulp.dest('dist/js/node/min/param'));
});
gulp.task('js-dist-conf', function() {
  return gulp.src('src/js/conf/*.json')
  .pipe(gulp.dest('dist/js/node/conf'))
  .pipe(gulp.dest('dist/js/node/min/conf'));
});


var js_dist_browser = function(from, out, to) {
  return browserify({
    entries: from
    //, debug: true
    //, plugin: [watchify]
  })
  .bundle()
  .on('error', $.util.log)
  .on('end', function() { $.util.log(out + ": browserify OK"); })
  .pipe($.plumber())
  .pipe(source(out))
  .on('end', function() { $.util.log(out + ": source out"); })
  .pipe(buffer())
  .pipe(gulp.dest(to))
  .on('end', function() { $.util.log(out + ": dest:" + to); })
  .pipe($.uglify())
  .on('end', function() { $.util.log(out + ": uglify end"); })
  .pipe(gulp.dest(to + "/min"));
};
gulp.task('js-dist-browser-1', function() {
  return js_dist_browser(
    'dist/js/node/Imy.js',
    'Imy.js',
    'dist/js/browser'
  );
});
gulp.task('js-dist-browser-2', function() {
  return js_dist_browser(
    'dist/js/node/ImyDBManager.js',
    'ImyDBManager.js',
    'dist/js/browser'
  );
});
gulp.task('js-dist-browser-3', function() {
  return js_dist_browser(
    'dist/js/node/ImyDBIndexedDB.js',
    'ImyDBIndexedDB.js',
    'dist/js/browser'
  );
});

gulp.task('spec', function() {
  return gulp.src('spec/*.js')
  .pipe($.jasmine({
    reporter: new SpecReporter()
  }));
});

gulp.task('build-js', function(callback) {
  return runSequence(
    [
      'js-dist',
      'js-dist-lib',
      'js-dist-param',
      'js-dist-conf'
    ],
    [
      'js-dist-browser-1',
      'js-dist-browser-2',
      'js-dist-browser-3'
    ],
    'spec',
    callback
  );
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean-all',
    ['build-js'],
    callback
  );
});

gulp.task('default', ['build'], function() {
  return gulp.watch([
    'src/js/*.js',
    'src/js/lib/*.js',
    'src/js/param/*.js',
    'src/js/conf/*.js',
    'spec/*.js'
  ], function() {
    runSequence(
      'build'
    );
  });
});

