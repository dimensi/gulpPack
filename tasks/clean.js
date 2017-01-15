const gulp     = require('gulp');
const rimraf   = require('rimraf');
const notifier = require('node-notifier');
const paths    = require('../tasks/paths.js');

gulp.task('clean', function (cb) {
	rimraf(paths.public, cb);
	notifier.notify({
		title: 'Task Clean',
		message: 'Завершен'
	});
});