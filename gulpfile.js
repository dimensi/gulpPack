const gulp          = require('gulp');
const watch         = require('gulp-watch');
const pug           = require('gulp-pug');
const stylus        = require('gulp-stylus');
const imagemin      = require('gulp-imagemin');
const autoprefixer  = require('gulp-autoprefixer');
const plumber       = require('gulp-plumber');
const tinypng       = require('gulp-tinypng-compress');
const cleanCss      = require('gulp-clean-css');
const changed       = require('gulp-changed');
const concatCss     = require('gulp-concat-css');
const rename        = require('gulp-rename');
const sourcemaps    = require('gulp-sourcemaps');
const gulpsync      = require('gulp-sync')(gulp);
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config');
const webpack       = webpackStream.webpack;
const combiner      = require('stream-combiner2').obj;
const rupture       = require('rupture');
const rimraf        = require('rimraf');
const browserSync   = require('browser-sync').create();
const path          = require('path');
const debug         = require('gulp-debug');
const named         = require('vinyl-named');
const production    = process.env.NODE_ENV === 'production';
const notify        = require('gulp-notify');
const onError = function(err) {
	console.error('!ERROR!');
	console.error(err);
};

const configs = {
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
		pretty: '\t',
		basedir: path.join(__dirname, 'app')
	},

	autoprefixer: {
		browsers: ['> 1%', 'last 3 iOS versions', 'Firefox ESR', 'last 2 versions', 'iOS 8.1']
	}

};

const paths = {
	app: './app',
	public: './public',

	pugs: './app/pages/*.pug',
	stylus: './app/styles/app.styl',
	assets: './app/assets/**/*',

	vendors: './app/vendors'
};


gulp.task('browser-sync', function () {
	browserSync.init(configs.browserConfig);
});

gulp.task('pug', function () {
	return gulp.src(paths.pugs)
		.pipe(plumber(configs.plumberError))
		.pipe(pug(configs.pug))
		.pipe(changed(paths.public, {
			extension: '.html',
			hasChanged: changed.compareSha1Digest
		}))
		.pipe(gulp.dest(paths.public))
		.pipe(browserSync.stream());
});

gulp.task('stylus', function () {
	return gulp.src(paths.stylus)
		.pipe(plumber(configs.plumberError))
		.pipe(sourcemaps.init())
		.pipe(stylus({
			use: rupture(),
			'import': [path.join(__dirname, paths.app + '/styles/helpers/flex-grid-framework.styl')]
		}))
		.pipe(autoprefixer(configs.autoprefixer))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(notify("Stylus готов"))
		.pipe(browserSync.stream());
});

gulp.task('vendorCss', function () {
	return gulp.src(paths.vendors + '/css/**/*')
		.pipe(plumber(configs.plumberError))
		.pipe(concatCss('all-styles.css'))
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(browserSync.stream());
});


/**
 * Старый код
 */

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
			sigFile: './assets/.tinypng-sigs',
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

gulp.task('assets', function () {
	return gulp.src(paths.assets)
		.pipe(plumber(configs.plumberError))
		.pipe(gulp.dest(paths.public))
})

gulp.task('build', gulpsync.sync(['clean', ['stylus', 'vendorCss', 'pug', 'assets'], 'images:build']));

/**
 * Очищаем папку
 */
gulp.task('clean', function (cb) {
	rimraf(paths.public, cb);
});

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

gulp.task('webpack', (cb) => {

	let firstBuildReady = false;
	const done = (err) => {
		firstBuildReady = true;
		if (err) {
			return null;
		}
	};

	if (production) {
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin()
		)
	}

	return combiner(
		gulp.src(paths.app + '/scripts/**/*.js'),
		debug({ title: 'webpack' }),
		named(),
		webpackStream(webpackConfig, null, done),
		gulp.dest(paths.public)
			.on('data', () => {
				if (firstBuildReady) {
					cb();
				}
			})
	);

});

gulp.task('default', gulpsync.sync(['clean', 'build', 'watch', ['webpack', 'browser-sync']]));