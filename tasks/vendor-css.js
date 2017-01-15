const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const plumber      = require('gulp-plumber');
const concatCss    = require('gulp-concat-css');
const cleanCss     = require('gulp-clean-css');
const browserSync  = require('browser-sync').create();
const notify       = require('gulp-notify');
const paths        = require('../tasks/paths');
const configs      = require('../tasks/configs');

gulp.task('vendorCss', function () {
	return gulp.src(paths.vendors + '/css/**/*')
		.pipe(plumber(configs.plumberError))
		.pipe(autoprefixer(configs.autoprefixer))
		.pipe(concatCss('all-styles.css'))
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(browserSync.stream())
		.pipe(notify({
			title: 'Таск VendorCss',
			message: 'Завершен'
		}));
});

gulp.task('vendorCss:min', function () {
	return gulp.src(paths.vendors + '/css/**/*')
		.pipe(plumber(configs.plumberError))
		.pipe(autoprefixer(configs.autoprefixer))
		.pipe(concatCss('all-styles.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(paths.public + '/css'));
});