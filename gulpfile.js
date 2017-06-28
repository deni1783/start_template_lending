'use strict'

const gulp        = require('gulp'),
      jade        = require('gulp-jade'),
      plumber     = require('gulp-plumber'),
      rename      = require('gulp-rename'),
      prefixer    = require('gulp-autoprefixer'),
      clean       = require('gulp-clean'),
      sass        = require('gulp-sass'),
      sourceMaps  = require('gulp-sourcemaps'),
      imagemin    = require('gulp-imagemin'),
      pngquant    = require('imagemin-pngquant'),
      browserSync = require('browser-sync'),
      reload      = browserSync.reload


// Так же создадим js объект в который пропишем все нужные нам пути,
// что бы при необходимости легко и в одном месте их редактировать:
const path = {

  // Готовые файлы
  dev: {
    jade  : 'dev/',
    js    : 'dev/js/',
    sass  : 'dev/css/',
    img   : 'dev/jmg/',
    fonts : 'dev/fonts/'
  },

  // Исходники
  src: {
    jade  : 'src/jade/index.jade',
    js    : 'src/js/main.js',
    sass  : 'src/sass/main.scss',
    img   : 'src/img/**/*.*',
    fonts : 'src/fonts/**/*.*'
  },

  // Файлы за которыми следим
  watch: {
    jade      : 'src/jade/**/*.jade',
    js        : 'src/js/**/*.js',
    sass      : 'src/sass/**/*.scss',
    img       : 'src/img/**/*.*',
    fonts     : 'src/fonts/**/*.*',
    indexHtml : 'dev/index.html'
  },

  clean: './dev'
};



// Параметры сервера
const serverConfig = {
  server: {
    baseDir: "./dev"
  },
  host      : 'localhost',
  port      : 4000,
  open      : true,
  notify    : false,
  logPrefix : "Frontend_Devil"
}


// Создание веб сервера
gulp.task("webserver", function (cb) {
  browserSync(serverConfig, cb);
});



// { since: gulp.lastRun('taskName') } 
// значит что нужно брать только те файлы, 
// которые изменилимь с последнего запуска задачи



// Собираем JADE
gulp.task('jade', function() {
  return gulp.src(path.src.jade, { since: gulp.lastRun('jade') })
    .pipe(plumber())
    .pipe(jade({pretty: true}))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(path.dev.jade))
    .pipe(reload({ stream: true }));
});



// Собираем SASS
gulp.task('sass', function () {
  return gulp.src(path.src.sass, { since: gulp.lastRun('sass') })              // берем файлы
    .pipe(plumber())
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(prefixer('last 3 versions'))
    .pipe(sourceMaps.write())
    .pipe(gulp.dest(path.dev.sass))
    .pipe(reload({ stream: true }));
});


// Оптимизация изображений
gulp.task('img', function () {
    return gulp.src(path.src.img, { since: gulp.lastRun('img') })
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dev.img));
});



// Очистка папки path.clean
gulp.task('clean', function() {
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});



// Наблюдение за файлами
gulp.task('watch', function() {
    gulp.watch(path.watch.sass, gulp.series('sass'));
    gulp.watch(path.watch.jade, gulp.series('jade'));
});


gulp.task('default', gulp.series(
    gulp.parallel('jade', 'sass'), 
    'webserver',
    'watch'))