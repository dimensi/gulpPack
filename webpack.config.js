const NODE_ENV = process.env.NODE_ENV || 'development';
const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');

/** Пути */
const paths = {
	assets: path.join(__dirname, 'app'),
	public: path.join(__dirname, 'public'),
	blocks: path.join(__dirname, 'app', 'blocks'),
	js: path.join(__dirname, 'app', 'javascripts'),
	vendors: path.join(__dirname, 'app', 'vendors', 'js')
};


const minChunks = 2;

module.exports = {

	/**
	 * Общий путь
	 */
	context: paths.assets,

	/**
	 * Точки входа
	 * Можно указать общий файл и в него, что-то общее добавить.
	 * common: "./javascript/common" и или можно включить в common другие файлы
	 * common: ["./javascript/welcome", "./javascript/common"]
	 */
	/**
	 * Куда сохранять js
	 */

	output: {
		publicPath: '/js/', // паблик патч лучше его указазывать его разным для продакшен
		library: '[name]',
	},

	/**
	 * Запускаю watch, если это разработка
	 */
	watch: NODE_ENV == 'development',

	/**
	 * Параметры для watch
	 */
	watchOptions: {
		aggregateTimeout: 150
	},

	/**
	 * Собираю source-map, разные при разных режимах
	 */
	devtool: NODE_ENV == 'development' ? 'source-map' : false,

	/**
	 * Подключаю плагины
	 * 1. DefinePlugin, он передает всякие переменные в клиент
	 * 2. NoErrorsPlugin - не ломает webpack при ошибках
	 * 3. CommonsChunkPlugin - собирает из всех файлов один общий.
	 * Если указать chunks: ['about', 'home']
	 * дублировать плагин до тех пор, пока не надоест, то можно будет осознанно собирать общее с разных страниц.
	 * 4. ProvidePlugin подключение глобальные библиотек
	 */
	plugins: [
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV)
		}),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common',
			minChunks: minChunks
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
		new HappyPack({
			loaders: ['babel-loader'],
			threads: 2,
			verbose: false,
			cache: true
		})
	],

	/**
	 * Библиотеки с CDN
	 */

	// externals: {
	//     jQuery: '$'
	// },


	/**
	 * Указываю пути где надо искать
	 */
	resolve: {
		modules: [
			paths.js,
			paths.vendors,
			paths.blocks,
			'node_modules'
		],
		alias: {
			jQuery: 'jquery',
			jquery: 'jquery',
		},
		extensions: ['.js',]
	},

	/**
	 * Указываю пути для лоадеров
	 */
	resolveLoader: {
		modules: ['node_modules'],
		extensions: ['.js']
	},

	/**
	 * Подключаю лоадеры
	 * 1. Babel
	 * 2. Pug
	 */
	module: {

		rules: [
			{
				test: /\.js$/,
				include: [paths.js, paths.blocks, paths.vendors],
				loader: 'happypack/loader'
			}
		]

	}
};


/**
 * Если продакшен, то сжимаю
 */
if (NODE_ENV == 'production') {
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				// don't show unreachable variables etc
				warnings: false,
				drop_console: true,
				unsafe: true,
			}
		})
	);
}