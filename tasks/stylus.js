const gulp         = require('gulp');
const stylus       = require('gulp-stylus');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps   = require('gulp-sourcemaps');
const plumber      = require('gulp-plumber');
const rupture      = require('rupture');
const browserSync  = require('browser-sync').create();
const path         = require('path');
const notify       = require('gulp-notify');
const stylint      = require('gulp-stylint');
const paths        = require('../tasks/paths.js');
const configs      = require('../tasks/configs');

gulp.task('stylus', function () {
	return gulp.src(paths.stylus)
		.pipe(plumber(configs.plumberError))
		.pipe(stylint())
		.pipe(stylint.reporter())
		.pipe(sourcemaps.init())
		.pipe(stylus({
			use: rupture()
		}))
		.pipe(autoprefixer(configs.autoprefixer))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(notify("Stylus готов"))
		.pipe(browserSync.stream());
});