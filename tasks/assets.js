const gulp          = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const paths         = require('../tasks/paths.js');
const configs       = require('../tasks/configs');
gulp.task('assets', function () {
	return gulp.src(paths.assets)
		.pipe(plumber(configs.plumberError))
		.pipe(gulp.dest(paths.public));
});