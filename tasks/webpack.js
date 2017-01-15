const gulp          = require('gulp');
const webpack       = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('../webpack.config');
const browserSync   = require('browser-sync').create();
const debug         = require('gulp-debug');
const named         = require('vinyl-named');
const gutil         = require('gulp-util');
const paths         = require('../tasks/paths.js');

gulp.task('webpack', () => {
	const done = (err, stats) => {
		if (err) {
			return err;
		}
		gutil.log('[webpack]', stats.toString({
			colors: gutil.colors.supportsColor,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false,
			modules: false,
			children: true,
			version: true,
			cached: false,
			cachedAssets: false,
			reasons: false,
			source: false,
			errorDetails: false
		}));
		browserSync.reload();
	};

	function handleError(err) {
		console.error(err.toString());
		this.emit('end');
	}

	return gulp.src(paths.app + '/scripts/**/*.js')
		.pipe(debug({
			title: 'webpack'
		}))
		.pipe(named())
		.pipe(webpackStream(webpackConfig, webpack, done))
		.on('error', handleError)
		.pipe(gulp.dest(paths.public));
});