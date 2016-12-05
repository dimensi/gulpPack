const gulp = require('gulp');
const zip = require('gulp-zip');
const path = require('path');

const correctNumber = number => number < 10 ? '0' + number : number;

const getDateTime = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = correctNumber(now.getMonth() + 1);
	const day = correctNumber(now.getDate());
	const hours = correctNumber(now.getHours());
	const minutes = correctNumber(now.getMinutes());

	return `${year}-${month}-${day}-${hours}${minutes}`;
};

gulp.task('zip', () => {
	const datetime = process.env.ZIP_DATE_TIME ? '-' + getDateTime() : '';
	const zipName = 'dist' + datetime + '.zip';

	gulp.src(['../public/**/*'])
		.pipe(zip(zipName))
		.pipe(gulp.dest(path.join(__dirname, '..')));
});