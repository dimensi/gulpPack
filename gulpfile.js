/**
 * Галп плагины
 */

var gulp         = require('gulp');
var watch        = require('gulp-watch');
var pug          = require('gulp-pug');
var stylus       = require('gulp-stylus');
var imagemin     = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var tinypng      = require('gulp-tinypng-compress');
var cleanCss     = require('gulp-clean-css');
var changed      = require('gulp-changed');
var concatCss    = require('gulp-concat-css');
var rename       = require('gulp-rename');
var sourcemaps   = require('gulp-sourcemaps');
var gulpsync     = require('gulp-sync')(gulp);

/**
 * Другие плагины
 */

var webpack          = require('webpack');
var webpackStream   = require('webpack-stream');
var webpackDevServer = require("webpack-dev-server");
var webpackConfig    = require("./webpack.config.js");
var rupture          = require('rupture');
var rimraf           = require('rimraf');
var browserSync      = require('browser-sync'),
    reload           = browserSync.reload;

var path = {
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

var onError = function (err) {
    console.error('!ERROR!');
    console.error(err);
};

var configs = {
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
        .pipe(changed(path.public, {extension: '.html', hasChanged: changed.compareSha1Digest}))
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
        .pipe(stylus(
            {
                use: rupture(),
                'import': [__dirname + '/assets/vendors/flex-grid-framework.styl']
            }
        ))
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
        .pipe(stylus(
            {
                use: rupture(),
                'import': [__dirname + '/assets/vendors/flex-grid-framework.styl']
            }
        ))
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
 		.pipe(imagemin({svgoPlugins: [{removeViewBox: false}]}))
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
        .pipe(gulp.dest(path.public + '/images'))
        .pipe(reload(configs.allowStreamReload));
});

/**
 * Общий таск на изображения
 */
gulp.task('images:build', ['svg','images:move']);


/**
 * Перемещаю шрифты
 */
 gulp.task('fonts', function() {
     gulp.src(path.fonts)
         .pipe(gulp.dest(path.public + '/fonts'))
         .pipe(reload(configs.allowStreamReload));
 });


/**
 * Собираю JS
 */

gulp.task('webpack', function() {
   return gulp.src(path.assets + '/javascript/home.js')
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
gulp.task('build', gulpsync.sync(['clean',['css:min', 'pug', 'fonts'], 'images:build']));
gulp.task('final', gulpsync.sync(['clean',['css:min', 'pug', 'fonts'], 'images:build', 'webpack']));


/**
 * Watch
 */
 gulp.task('watch', function() {
     watch([configs.watch.stylus], function(event,cb) {
         gulp.start('stylus');
     });
     watch([configs.watch.pugs], function(event,cb) {
         gulp.start('pug');
     });
     watch([configs.watch.pugsBlock], function(event,cb) {
         gulp.start('pug');
     });
     watch([configs.watch.fonts], function(event,cb) {
         gulp.start('fonts');
     });
     watch([configs.watch.vendorsCss], function(event,cb) {
         gulp.start('vendorCss');
     });
     watch([configs.watch.svg], function(event,cb) {
         gulp.start('svg');
     });
     watch([configs.watch.svgBlock], function(event,cb) {
         gulp.start('svg');
     });
     watch([configs.watch.images], function(event,cb) {
         gulp.start('images:move');
     });
     watch([configs.watch.imagesBlock], function(event,cb) {
         gulp.start('images:move');
     });
 });

/**
 * Default
 */

gulp.task('default', gulpsync.sync(['build', 'watch', ['webpack', 'browser-sync']]));