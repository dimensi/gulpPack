const gulp       = require('gulp');
const gulpsync   = require('gulp-sync')(gulp);
const requireDir = require('require-dir');
requireDir('./tasks');

gulp.task('build', gulpsync.sync(['clean', ['stylus', 'vendorCss', 'pug', 'assets', 'images']]));
gulp.task('build:final', gulpsync.sync(['clean', ['pug', 'stylus:min', 'vendorCss:min', 'assets'], 'images:build', 'webpack']));

gulp.task('default', gulpsync.sync(['build', 'watch', ['webpack', 'browser-sync']]));