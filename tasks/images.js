const gulp          = require('gulp');
const imagemin      = require('gulp-imagemin');
const plumber       = require('gulp-plumber');
const tinypng       = require('gulp-tinypng-compress');
const browserSync   = require('browser-sync').create();
const notify        = require('gulp-notify');
const paths         = require('../tasks/paths.js');
const configs       = require('../tasks/configs');
/**
 * Сжимаем svg отдельно
 */
gulp.task('svg', function () {
	return gulp.src([paths.app + '/images/**/*.{svg,gif}', paths.app + '/blocks/**/*.{svg,gif}'])
		.pipe(plumber(configs.plumberError))
		.pipe(imagemin({
			svgoPlugins: [{
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest(paths.public + '/images'))
});


/**
 * Сжимаем картинки через TinyPng
 */
gulp.task('images', function () {
	return gulp.src([paths.app + '/images/**/*.{png,jpg,jpeg}', paths.app + '/blocks/**/*.{png,jpg,jpeg}'])
		.pipe(plumber(configs.plumberError))
		.pipe(tinypng({
			key: 'ZVe46i6n5KZuVPAqoHiHtIXt2QU--pxi',
			sigFile: './app/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest(paths.app + '/compressed'));
});


/**
 * Объявил зависимость между задачами и перемещаю картинки
 */
gulp.task('images:move', ['images'], function () {
	return gulp.src(paths.app + "/compressed/**/*")
		.pipe(plumber(configs.plumberError))
		.pipe(gulp.dest(paths.public + '/images'))
});

/**
 * Общий таск на изображения
 */
gulp.task('images:build', ['svg', 'images:move']);