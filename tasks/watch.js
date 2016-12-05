const gulp          = require('gulp');
const watch         = require('gulp-watch');
const browserSync   = require('browser-sync').create();
const notify        = require('gulp-notify');
const paths         = require('../tasks/paths.js');

gulp.task('watch', function () {
	watch([paths.app + '/styles/**/*.styl', paths.app + '/blocks/**/*.styl'], function (event, cb) {
		gulp.start('stylus');
	});
	watch([paths.app + '/pages/**/*.pug', paths.app + '/blocks/**/*.pug'], function (event, cb) {
		gulp.start('pug');
	});
	watch([paths.assets], function (event, cb) {
		gulp.start('assets');
		browserSync.reload();
	});
	watch([paths.app + 'vendors/**/*.css'], function (event, cb) {
		gulp.start('vendorCss');
	});
	watch([paths.app + 'images/**/*.{svg, gif}', paths.app + 'blocks/**/*.{svg, gif}'], function (event, cb) {
		gulp.start('svg');
		browserSync.reload();
	});
	watch([paths.app + 'images/**/*.{png,jpg,jpeg}', paths.app + 'blocks/**/*.{png,jpg,jpeg}'], function (event, cb) {
		gulp.start('images:move');
		browserSync.reload();
	});
});