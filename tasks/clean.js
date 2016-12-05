const gulp          = require('gulp');
const rimraf        = require('rimraf');
const paths         = require('../tasks/paths.js');
gulp.task('clean', function (cb) {
	rimraf(paths.public, cb);
});