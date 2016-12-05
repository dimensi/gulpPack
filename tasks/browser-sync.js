const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const configs     = require('../tasks/configs');

gulp.task('browser-sync', function () {
	browserSync.init(configs.browserConfig);
});