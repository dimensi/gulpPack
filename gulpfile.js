const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync').create();
const autoCloseBS = require('browser-sync-close-hook');
const path = require('path');
const rupture = require('rupture');
const webpackStream = require('webpack-stream');
const webpackOptions = require('./webpack.config');
const named = require('vinyl-named');
const gulplog = require('gulplog');
const mkdir = require('mkdirp');
const notifier = require('node-notifier');
const emitty = require('emitty').setup('app', 'pug');
const getData = require('jade-get-data');
const data = {
	getData: getData('app/data'),
	jv0: 'javascript:void(0);'
};


const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const paths = {
	app: './app',
	public: './public',

	assets: './app/assets/**/*.*',

	pugs: './app/pages/*.pug',
	pugsWatch: [
		'./app/pages/*.pug',
		'./app/blocks/**/*.pug'
	],

	stylus: './app/styles/app.styl',
	stylusWatch: './app/blocks/**/*.styl',

	vendorsCss: [
		'./node_modules/normalize.css/normalize.css',
		'./app/vendors/css/**/*'
	],

	imagesDev: [
		'./app/images/**/*.{png,jpg,jpeg,svg,gif}',
		'./app/blocks/**/*.{png,jpg,jpeg,svg,gif}'
	],
	imagesSvg: [
		'./app/images/**/*.{svg,gif}',
		'./app/blocks/**/*.{svg,gif}'
	],
	images: [
		'./app/images/**/*.{png,jpg,jpeg}',
		'./app/blocks/**/*.{png,jpg,jpeg}'
	],

	javascripts: './app/javascripts/*.js'

};

const config = {

	browserConfig: {
		ui: false,
		server: {
			baseDir: paths.public
		},
		reloadDebounce: 2000,
		tunnel: false,
		port: 3000,
		logPrefix: 'FrontEnd Server'
	},

	plumber(title = 'TASK') {
		return {
			errorHandler: $.notify.onError(err => ({
				title: `ERROR ${title}`,
				message: err.message
			}))
		};
	},

	pug: {
		pretty: '\t',
		basedir: __dirname,
		data
	},
	

	stylus: {
		use: rupture(),
		'include css': true,
		include: path.join(__dirname, '..', 'node_modules')
	},

	autoprefixer: {
		browsers: ['> 5%', 'last 6 iOS versions']
	},

	imagemin: {
		svgoPlugins: [{
			removeViewBox: false
		}]
	},

	tinypng: {
		key: 'ZVe46i6n5KZuVPAqoHiHtIXt2QU--pxi',
		sigFile: './app/.tinypng-sigs',
		log: true
	},

	dirs: [
		'./app/assets/fonts',
		'./app/images',
		'./app/vendors/css',
		'./app/vendors/js',
		'./app/data'
	]
};


gulp.task('mkdirs', done => {
	config.dirs.forEach(dir => {
		mkdir(dir);
	});
	
	notifier.notify({
		title: 'Папки',
		message: 'Созданы'
	});
	
	done()
});

gulp.task('clean', () => 
	del(paths.public)
);

gulp.task('assets', () => 
	gulp.src(paths.assets, { since: gulp.lastRun('assets') })
		.pipe($.plumber(config.plumber('ASSETS')))
		.pipe(gulp.dest(paths.public))
);

gulp.task('serve', () => {
	browserSync.use({
		plugin() {},
		hooks: {
			'client:js': autoCloseBS
		}
	});
	browserSync.init(config.browserConfig);
	browserSync.watch(paths.public + '/js/*.js').on('change', browserSync.reload);
	browserSync.watch(paths.public + '/*.html').on('change', browserSync.reload);
});


gulp.task('pug', () => 
	gulp.src(paths.pugs)
		.pipe($.plumber(config.plumber('PUG')))
		.pipe($.if(global.watch, emitty.stream(global.emittyChangedFile)))
		.pipe($.pug(config.pug))
		.pipe($.changed(paths.public, {
			extension: '.html',
			hasChanged: $.changed.compareSha1Digest
		}))
		.pipe($.debug({ title: 'PUG' }))
		.pipe(gulp.dest(paths.public))
);


gulp.task('stylus', () =>
	gulp.src(paths.stylus)
		.pipe($.plumber(config.plumber('Stylus')))
		.pipe($.if(isDevelopment, $.sourcemaps.init()))
		.pipe($.stylus(config.stylus))
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe($.if(isDevelopment, $.sourcemaps.write('.')))
		.pipe($.if(!isDevelopment, $.cleanCss()))
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(browserSync.stream({match: '**/*.css'}))
);

gulp.task('vendorCss', () => 
	gulp.src(paths.vendorsCss)
		.pipe($.plumber(config.plumber('VendorCSS')))
		.pipe($.autoprefixer(config.autoprefixer))
		.pipe($.concatCss('all-styles.css', {
			rebaseUrls: false
		}))
		.pipe($.if(!isDevelopment, $.cleanCss()))
		.pipe(gulp.dest(paths.public + '/css'))
		.pipe(browserSync.stream())
);


gulp.task('images:dev', () => 
	gulp.src(paths.imagesDev, { since: gulp.lastRun('images:dev') })
		.pipe(gulp.dest(paths.public + '/images'))
);

gulp.task('svg', () => 
	gulp.src(paths.imagesSvg)
		.pipe($.plumber(config.plumber('SVG MIN')))
		.pipe($.imagemin(config.imagemin))
		.pipe(gulp.dest(paths.public + '/images'))
);

gulp.task('images:min', () =>
	gulp.src(paths.images)
		.pipe($.plumber(config.plumber('TINYPNG')))
		.pipe($.tinypngCompress(config.tinypng))
		.pipe(gulp.dest(paths.app + '/compressed'))
);

gulp.task('images:move',
	gulp.series('images:min', () =>
		gulp.src(paths.app + '/compressed/**/*')
		.pipe($.plumber(config.plumber('TINYPNG:MOVE')))
		.pipe(gulp.dest(paths.public + '/images'))
	)
);

gulp.task('images:build', gulp.parallel('svg', 'images:move'));

gulp.task('webpack', callback	=> {
	let firstBuildReady = false;
	function done(err, stats) {
		firstBuildReady = true;
		if (err) {
			return;
		}

		gulplog[stats.hasError ? 'error' : 'info'](stats.toString({
			colors: true,
			modules: false,
			chunks: !isDevelopment // TRUE для отображения подключаемых модулей.
		}));
	}

	return gulp.src(paths.javascripts)
		.pipe($.plumber(config.plumber('WEBPACK')))
		.pipe(named())
		.pipe(webpackStream(webpackOptions, null, done))
		.pipe(gulp.dest(paths.public + '/js'))
		.on('data', () => {
			if (firstBuildReady) {
				callback();
			}
		});
});

gulp.task('watch', () => {
	global.watch = true;
	
	gulp.watch(paths.assets, gulp.series('assets')).on('change', browserSync.reload);
	gulp.watch(paths.pugsWatch, gulp.series('pug'))
	.on('all', (event, filepath) => {
		global.emittyChangedFile = filepath;
	});
	gulp.watch(paths.stylusWatch, gulp.series('stylus'));
	gulp.watch(paths.vendorsCss, gulp.series('vendorCss'));
	gulp.watch(paths.imagesDev, gulp.series('images:dev')).on('change', browserSync.reload);
});


const correctNumber = number => number < 10 ? '0' + number : number;
const getDateTime = () => {
	const now = new Date();
	const year = (''.slice.call(now.getFullYear())).slice(-2);
	const month = correctNumber(now.getMonth() + 1);
	const day = correctNumber(now.getDate());
	const hours = correctNumber(now.getHours());
	const minutes = correctNumber(now.getMinutes());

	return `${year}-${month}-${day}_${hours}-${minutes}`;
};


gulp.task('zip', () => {
	const datetime = '-' + getDateTime();
	const zipName = 'dist' + datetime + '.zip';

	return gulp.src('./public/**/*')
		.pipe($.zip(zipName))
		.pipe(gulp.dest('.'));
});


gulp.task('build:dev',
	gulp.series('clean',
		gulp.parallel('assets', 'pug', 'stylus', 'vendorCss', 'images:dev', 'webpack')
	)
);
gulp.task('build',
	gulp.series('clean',
		gulp.parallel('assets', 'pug', 'stylus', 'vendorCss', 'images:build', 'webpack')
	)
);

gulp.task('default',
	gulp.series('build:dev',
		gulp.parallel('watch', 'serve')
	)
);