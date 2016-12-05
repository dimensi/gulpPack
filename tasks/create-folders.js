const gulp = require('gulp');
const mkdir = require('mkdirp');
const notifier = require('node-notifier');

const dirs = [
	'./app/assets/fonts',
	'./app/images',
	'./app/vendors/css',
	'./app/vendors/js',
	'./app/data'
];

gulp.task('mkdirs', function() {
	dirs.forEach(function(dir) {
		mkdir(dir);
	});
	return notifier.notify({
		title: 'Папки',
		message: 'Созданы'
	});
});