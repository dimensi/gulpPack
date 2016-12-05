const gulp       = require('gulp');
const gulpsync   = require('gulp-sync')(gulp);
const requireDir = require('require-dir');
requireDir('./tasks');

gulp.task('build', gulpsync.sync(['clean', ['stylus', 'vendorCss', 'pug', 'assets'], 'images:build']));
gulp.task('default', gulpsync.sync(['clean', 'build', 'watch', ['browser-sync']]));