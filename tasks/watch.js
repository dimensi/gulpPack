const gulp          = require('gulp');
const watch         = require('gulp-watch');
const paths         = require('../tasks/paths.js');

gulp.task('watch', function () {
	watch([paths.app + '/styles/**/*.styl', paths.app + '/blocks/**/*.styl'], function () {
		gulp.start('stylus');
	});
	watch([paths.app + '/pages/**/*.pug', paths.app + '/blocks/**/*.pug'], function () {
		gulp.start('pug');
	});
	watch([paths.assets], function () {
		gulp.start('assets');
	});
	watch([paths.app + '/vendors/**/*.css'], function () {
		gulp.start('vendorCss');
	});
	watch([paths.app + '/images/*.*', paths.app + '/blocks/**/*.{svg,png,jpeg,jpg,gif}'], function() {
		gulp.start('images');
	});
});