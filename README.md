###gulpPack - мой личный заготовленный набор для верстки. 

## TOC ##


- [FrontEnd Ruranobe](#frontend-ruranobe)
  * [Зависимости](#Зависимости)
  * [Первый запуск](#Первый-запуск)
  * [Команды](#Команды)
    + [`yarn start` или `npm start`](#yarn-start-или-npm-start)
    + [`yarn build` или `npm run build`](#yarn-build-или-npm-run-build)
    + [`yarn run clean` или `npm run clean`](#yarn-run-clean-или-npm-run-clean)
    + [`gulp`](#gulp)
    + [`gulp assets`](#gulp-assets)
    + [`gulp pug`](#gulp-pug)
    + [`gulp stylus`](#gulp-stylus)
    + [`gulp vendorCss`](#gulp-vendorcss)
    + [`gulp images:move`](#gulp-imagesmove)
    + [`gulp svg`](#gulp-svg)
    + [`gulp images:dev`](#gulp-imagesdev)
    + [`gulp images:build`](#gulp-imagesbuild)
    + [`gulp webpack`](#gulp-webpack)
    + [`gulp watch`](#gulp-watch)
    + [`gulp serve`](#gulp-serve)
    + [`build:dev`](#builddev)
    + [`build`](#build)
  * [Установленные пакеты](#Установленные-пакеты)


## Зависимости ##
`Node ^6.0`

## Первый запуск ##
`yarn` или `npm init`
`yarn run first:start` или `npm run first:start`

## Команды ##

### `yarn start` или `npm start`
Запускает проект в дев режиме.
### `yarn build` или `npm run build`
Собирает проект и оптимизирует
### `yarn run clean` или `npm run clean`
Удаляет папку public
### `gulp`
Запускает проект в дев режиме (лучше не использовать)
### `gulp assets`
Переносит файлы из папки assets в корень папки public
### `gulp pug`
Собирает html из pug файлов
### `gulp stylus`
Собирает стили из stylus
### `gulp vendorCss`
Собирает стили из папки vendors css + normalize.css
### `gulp images:move`
Собирает только png,jpg,jpeg и сжимает их
### `gulp svg`
Собирает только svg,gif и сжимает их
### `gulp images:dev`
Собирает все картинки и переносит их, не сжимает
### `gulp images:build`
Собирает все картинки, сжимает и переносит
### `gulp webpack`
Запускает вебпак и собирает скрипты
### `gulp watch`
Запускает watcher за файлами
### `gulp serve`
Запускает локальный сервер на порт 3000
### `gulp build:dev`
Собирает все, но не оптимизирует
### `gulp build`
Собирает все и оптимизирует
### `gulp zip`
Собирает архив из public


## Установленные пакеты ##
```
    "babel-core": "^6.21.0",
    "babel-loader": "^6.2.10",
    "babel-plugin-transform-class-properties": "^6.19.0",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.18.0",
    "babel-plugin-transform-object-rest-spread": "^6.20.2",
    "babel-plugin-transform-runtime": "^6.15.0",
    "babel-preset-env": "^1.1.8",
    "babel-preset-es2015": "^6.18.0",
    "babel-runtime": "^6.20.0",
    "bemto.pug": "^2.1.0",
    "browser-sync": "^2.18.6",
    "browser-sync-close-hook": "^1.0.5",
    "cross-env": "^3.1.4",
    "del": "^2.2.2",
    "eslint": "^3.13.1",
    "exports-loader": "^0.6.3",
    "expose-loader": "^0.7.1",
    "gulp": "gulpjs/gulp#4.0",
    "gulp-autoprefixer": "^3.1.1",
    "gulp-changed": "^1.3.2",
    "gulp-clean-css": "^2.3.2",
    "gulp-concat-css": "^2.3.0",
    "gulp-debug": "^3.0.0",
    "gulp-if": "^2.0.2",
    "gulp-imagemin": "^3.1.1",
    "gulp-load-plugins": "^1.4.0",
    "gulp-notify": "^2.2.0",
    "gulp-plumber": "^1.1.0",
    "gulp-pug": "^3.2.0",
    "gulp-sourcemaps": "^2.4.0",
    "gulp-stylus": "^2.6.0",
    "gulp-tinypng-compress": "^1.2.1",
    "gulp-zip": "^3.2.0",
    "gulplog": "^1.0.0",
    "happypack": "^3.0.2",
    "imports-loader": "^0.7.0",
    "jade-get-data": "^1.0.1",
    "jquery": "^3.1.1",
    "mkdirp": "^0.5.1",
    "node-notifier": "^4.6.1",
    "normalize.css": "^5.0.0",
    "rupture": "^0.6.2",
    "script-loader": "^0.7.0",
    "stream-combiner2": "^1.1.1",
    "vinyl-named": "^1.1.0",
    "webpack": "^1.14.0",
    "webpack-stream": "jeroennoten/webpack-stream#patch-1"
 ```