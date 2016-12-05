const gulp          = require('gulp');
const webpackStream = require('webpack-stream');
const webpackConfig = require('../webpack.config');
const webpack       = webpackStream.webpack;
const combiner      = require('stream-combiner2').obj;
const production    = process.env.NODE_ENV === 'production';
const paths         = require('../tasks/paths.js');

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