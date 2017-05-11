'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var nodemon = require('gulp-nodemon');

gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
    return process.env.NODE_ENV = 'development';
});


gulp.task('express', ['watch','set-dev-node-env'], function ()
{
    return nodemon({
        script: path.join(conf.paths.server, 'app.js'),
        watch: conf.paths.server
    });
});

gulp.task('express:dist', ['build', 'set-prod-node-env'], function ()
{
    return nodemon({
        script: path.join(conf.paths.server, 'app.js'),
        watch: conf.paths.server
    });
});



// gulp.task('reload:browser', function (callback)
// {
//     var called = false;
//      return nodemon({
//        script: path.join(conf.paths.server, 'app.js'),
//        ignore: [
//          'gulpfile.js',
//          'node_modules/',
//          'client/',
//          'bower_components/'
//        ]
//      })
//      .on('start', function () {
//        if (!called) {
//          called = true;
//          callback();
//        }
//      })
//      .on('restart', function () {
//        setTimeout(function () {
//          reload({ stream: false });
//        }, 1000);
//      });
// });