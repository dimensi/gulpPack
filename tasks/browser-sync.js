const gulp        = require('gulp');
const browserSync = require('browser-sync').create();
const configs     = require('../tasks/configs');
const watch       = require('gulp-watch');

gulp.task('browser-sync', function () {
	browserSync.init(configs.browserConfig);
	browserSync.watch('./public/**').on('change', browserSync.reload);
	watch('./public/images/**/*', browserSync.reload);
});