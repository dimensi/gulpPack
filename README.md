###gulpPack - мой личный заготовленный набор для верстки. 

## TOC ##


- [GulpPack](#)
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