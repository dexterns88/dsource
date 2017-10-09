//VARIABLES
var gulp = require('gulp'),
    gp_assets = require('postcss-assets'),
    gp_sass = require('gulp-sass'),
    gp_sourcemaps = require('gulp-sourcemaps'),
    gp_postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    postcss_font_awesome = require('postcss-font-awesome'),
    browserSync = require('browser-sync').create(),
    gp_concat = require('gulp-concat'),
    gp_uglify = require('gulp-uglify'),
    gp_filter = require('gulp-filter'),
    gp_header = require('gulp-header'),
    postcss_svg = require('postcss-svg'),
    processors = [
      autoprefixer({
        browsers: ['last 5 versions', 'IE 9', 'IE 10'],
        cascade: false
      }),
      postcss_font_awesome,
      gp_assets({
        loadPaths: ['source/images']
      }),
      postcss_svg({
        paths: ['source/svg']
      })
    ],
    jsfiles = [
      'source/js/app.js'
    ],
    scssfiles = [
      'source/scss/*.scss'
    ],
    fonts = [
      'node_modules/font-awesome/fonts/*'
    ];

//SETTINGS
// Added task for browser-sync
gulp.task('browser-sync', function() {
  browserSync.init({
    // proxy: 'holidays.co.rs'  // for remote proxy change
    server: {
      baseDir: "./"   // for local change
    },
    open: false
  });
});


//FA FONTS
gulp.task('fonts', function() {
  return gulp.src(fonts)
    .pipe(gulp.dest('fonts'));
});

//CSS
gulp.task('styles', function() {
  return gulp.src(scssfiles)
    .pipe(gp_header('$debug: true;'))
    .pipe(gp_sourcemaps.init())
    .pipe(gp_sass().on('error', gp_sass.logError))
    .pipe(gp_postcss(processors))
    .pipe(gp_concat('screen.css'))
    .pipe(gp_sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(gp_filter('**/*.css'))
    .pipe(browserSync.stream());
    // .pipe(browserSync.reload({stream: true}));
});

//CSS MINIFY
gulp.task('styles_prod', function() {
  return gulp.src(scssfiles)
    .pipe(gp_sass({outputStyle: 'compressed'}).on('error', gp_sass.logError))
    .pipe(gp_postcss(processors))
    .pipe(gulp.dest('dist/css'));
});


//JS
gulp.task('scripts', function() {
  return gulp.src(jsfiles)
    .pipe(gp_sourcemaps.init())
    .pipe(gp_concat('scripts.js'))
    .pipe(gp_sourcemaps.write('./'))
    .pipe(browserSync.stream())
    .pipe(gulp.dest('dist/js'));
});


//JS MINIFY/UGLIFY
gulp.task('scripts_prod', function() {
  return gulp.src(jsfiles)
    .pipe(gp_concat('scripts.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('dist/js'));
});

//WATCH
// gulp.task('watch' ,['browser-sync'] , function() {

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch(scssfiles, ['styles']);
  gulp.watch(jsfiles, ['scripts']);
  gulp.watch('*.html').on('change', browserSync.reload);
});

gulp.task('w', ['browser-sync'], function() {
  gulp.watch(scssfiles, ['styles']);
  gulp.watch(jsfiles, ['scripts']);
  gulp.watch('*.html').on('change', browserSync.reload);
});


//DEFAULT
gulp.task('default', ['styles_prod', 'scripts_prod']);
