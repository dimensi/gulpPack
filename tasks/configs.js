const path = require('path');
const onError = function(err) {
	console.error('!ERROR!');
	console.error(err);
};
module.exports = {
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