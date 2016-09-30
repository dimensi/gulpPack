/**
 * Галп плагины
 */

const gulp         = require('gulp');
const watch        = require('gulp-watch');
const pug          = require('gulp-pug');
const stylus       = require('gulp-stylus');
const imagemin     = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const plumber      = require('gulp-plumber');
const tinypng      = require('gulp-tinypng-compress');
const cleanCss     = require('gulp-clean-css');
const changed      = require('gulp-changed');
const concatCss    = require('gulp-concat-css');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');
const gulpsync     = require('gulp-sync')(gulp);

/**
 * Другие плагины
 */

const webpack          = require('webpack');
const webpackStream    = require('webpack-stream');
const webpackDevServer = require("webpack-dev-server");
const webpackConfig    = require("./webpack.config.js");
const rupture          = require('rupture');
const rimraf           = require('rimraf');
const browserSync      = require('browser-sync');
const reload           = browserSync.reload;

const path = {
	assets: "./assets",
	public: "./public",

	vendorCss: [
		'./node_modules/normalize.css/normalize.css',
		'./assets/vendors/css/*.css'
	],

	pugs: './assets/templates/*.pug',

	stylus: [
		'./assets/blocks/**/+(page|!*).styl'
	],
	fonts: './assets/fonts/**/**.*'
};

const onError = function(err) {
	console.error('!ERROR!');
	console.error(err);
};

const configs = {
	//Standalone browser settings for browser-sync
	browserConfig: {
		server: {
			baseDir: "./public/"
		},
		reloadDelay: 1500,
		tunnel: false,
		host: 'localhost',
		port: 3000,
		logPrefix: 'FrontEnd Server'
	},
	plumberError: {
		errorHandler: onError
	},
	allowStreamReload: {
		stream: true
	},
	pug: {
		pretty: '\t'
	},

	watch: {
		fonts: path.fonts,
		stylus: './assets/blocks/**/*.styl',
		pugs: './assets/templates/*.pug',
		pugsBlock: './assets/blocks/**/*.pug',
		images: './assets/images/*.{png,jpg,jpeg}',
		imagesBlock: './assets/blocks/**/*.{png,jpg,jpeg}',
		svg: path.assets + '/images/**/*.{svg,gif}',
		svgBlock: path.assets + '/blocks/**/*.{svg,gif}',
		vendorsCss: './assets/vendors/css/*.css'
	}
};


/**
 * Browser-sync сервер
 */
gulp.task('browser-sync', function() {
	browserSync.init(configs.browserConfig);
});


/**
 * Собираем html из pug
 */
gulp.task('pug', function() {
	gulp.src(path.pugs)
		.pipe(plumber(configs.plumberError))
		.pipe(pug(configs.pug))
		.pipe(changed(path.public, {
			extension: '.html',
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest(path.public))
		.pipe(reload(configs.allowStreamReload));
});


/**
 * Собираем css из styl
 */
gulp.task('stylus', function() {
	gulp.src(path.stylus)
		.pipe(plumber(configs.plumberError))
		.pipe(sourcemaps.init())
		.pipe(stylus({
			use: rupture(),
			'import': [__dirname + '/assets/vendors/flex-grid-framework.styl']
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 iOS versions', 'Firefox ESR', 'last 2 versions', 'iOS 8.1']
		}))
		.pipe(rename('style.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(path.public + '/css'))
		.pipe(reload(configs.allowStreamReload));
});

/**
 * Пришлось создать, из-за source-map ломалось все.
 */
gulp.task('stylus:min', function() {
	gulp.src(path.stylus)
		.pipe(plumber(configs.plumberError))
		.pipe(stylus({
			use: rupture(),
			'import': [__dirname + '/assets/vendors/flex-grid-framework.styl']
		}))
		.pipe(autoprefixer({
			browsers: ['> 1%', 'last 3 iOS versions', 'Firefox ESR', 'last 2 versions', 'iOS 8.1']
		}))
		.pipe(rename('style.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(path.public + '/css'))
		.pipe(reload(configs.allowStreamReload));
});

/**
 * Собираем стили от поставщиков
 */
gulp.task('vendorCss', function() {
	gulp.src(path.vendorCss)
		.pipe(plumber(configs.plumberError))
		.pipe(concatCss('all-styles.css'))
		.pipe(cleanCss())
		.pipe(gulp.dest(path.public + '/css'))
		.pipe(reload(configs.allowStreamReload));
});


/**
 * Минифицируем стили
 */
gulp.task('css:min', ['stylus:min', 'vendorCss']);


/**
 * Сжимаем svg отдельно
 */
gulp.task('svg', function() {
	gulp.src([path.assets + '/images/**/*.{svg,gif}', path.assets + '/blocks/**/*.{svg,gif}'])
		.pipe(plumber(configs.plumberError))
		.pipe(imagemin({
			svgoPlugins: [{
				removeViewBox: false
			}]
		}))
		.pipe(gulp.dest(path.public + '/images'))
		.pipe(reload(configs.allowStreamReload));
});


/**
 * Сжимаем картинки через TinyPng
 */
gulp.task('images', function() {
	return gulp.src([path.assets + '/images/**/*.{png,jpg,jpeg}', path.assets + '/blocks/**/*.{png,jpg,jpeg}'])
		.pipe(plumber(configs.plumberError))
		.pipe(tinypng({
			key: 'ZVe46i6n5KZuVPAqoHiHtIXt2QU--pxi',
			sigFile: './assets/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest(path.assets + '/compressed'));
});


/**
 * Объявил зависимость между задачами и перемещаю картинки
 */
gulp.task('images:move', ['images'], function() {
	gulp.src(path.assets + "/compressed/**/*")
		.pipe(plumber(configs.plumberError))
		.pipe(gulp.dest(path.public + '/images'))
		.pipe(reload(configs.allowStreamReload));
});

/**
 * Общий таск на изображения
 */
gulp.task('images:build', ['svg', 'images:move']);


/**
 * Перемещаю шрифты
 */
gulp.task('fonts', function() {
	gulp.src(path.fonts)
		.pipe(plumber(configs.plumberError))
		.pipe(gulp.dest(path.public + '/fonts'))
		.pipe(reload(configs.allowStreamReload));
});


/**
 * Собираю JS
 */

gulp.task('webpack', function() {
	return gulp.src(path.assets + '/javascript/*.js')
		.pipe(plumber(configs.plumberError))
		.pipe(webpackStream(webpackConfig))
		.pipe(gulp.dest(path.public));
});

/**
 * Очищаем папку
 */

gulp.task('clean', function(cb) {
	rimraf(path.public, cb);
});

/**
 * Build
 */
gulp.task('build', gulpsync.sync(['clean', ['css:min', 'pug', 'fonts'], 'images:build']));
gulp.task('final', gulpsync.sync(['clean', ['css:min', 'pug', 'fonts'], 'images:build', 'webpack']));


/**
 * Watch
 */
gulp.task('watch', function() {
	watch([configs.watch.stylus], function(event, cb) {
		gulp.start('stylus');
	});
	watch([configs.watch.pugs], function(event, cb) {
		gulp.start('pug');
	});
	watch([configs.watch.pugsBlock], function(event, cb) {
		gulp.start('pug');
	});
	watch([configs.watch.fonts], function(event, cb) {
		gulp.start('fonts');
	});
	watch([configs.watch.vendorsCss], function(event, cb) {
		gulp.start('vendorCss');
	});
	watch([configs.watch.svg], function(event, cb) {
		gulp.start('svg');
	});
	watch([configs.watch.svgBlock], function(event, cb) {
		gulp.start('svg');
	});
	watch([configs.watch.images], function(event, cb) {
		gulp.start('images:move');
	});
	watch([configs.watch.imagesBlock], function(event, cb) {
		gulp.start('images:move');
	});
});

/**
 * Default
 */

gulp.task('default', gulpsync.sync(['build', 'watch', ['webpack', 'browser-sync']]));
