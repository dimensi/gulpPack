const gulp        = require('gulp');
const pug         = require('gulp-pug');
const plumber     = require('gulp-plumber');
const changed     = require('gulp-changed');
const browserSync = require('browser-sync').create();
const notify      = require('gulp-notify');
const paths       = require('../tasks/paths.js');
const configs     = require('../tasks/configs');

gulp.task('pug', function () {
	return gulp.src(paths.pugs)
		.pipe(plumber(configs.plumberError))
		.pipe(pug(configs.pug))
		.pipe(changed(paths.public, {
			extension: '.html',
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest(paths.public))
		.pipe(browserSync.stream())
		.pipe(notify({
			title: 'Task Pug',
			message: 'Завершен'
		}));
});