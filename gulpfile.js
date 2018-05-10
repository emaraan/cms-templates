var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');


// Development Tasks ----------------------------------------
// -----------------------------------------------------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/styles/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sass())
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(gulp.dest('dist/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
})

// Watchers
gulp.task('watch', function() {
  gulp.watch('app/styles/**/*.scss', ['sass']);
  gulp.watch('app/scripts/**/*.js', browserSync.reload);
})

// Optimization Tasks ----------------------------------------
// -----------------------------------------------------------

// Optimizing CSS and JavaScript
gulp.task('useref', function() {

  return gulp.src('./app/**/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano({
           discardComments: {removeAll: true}
       })))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images
gulp.task('images', function() {
  return gulp.src('app/styles/img/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/css/img'))
});

// Copying fonts
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

// Copy images

gulp.task('build-images', function() {
  return gulp.src('app/styles/images/*.{gif,jpg,png,svg}')
      .pipe(gulp.dest('dist/images'));
});

// Cleaning
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequences --------------------------------------------
// -----------------------------------------------------------


// Archive distribution package

gulp.task('zip', () =>
    gulp.src('dist/**/*')
        .pipe(zip('Decorator-V5.zip'))
        .pipe(gulp.dest('.'))
);


gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch',
    callback
  )
})

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    ['useref', 'images', 'fonts'],
    callback
  )
})

// Live Development with BrowserSync --------------------------------------------
// -----------------------------------------------------------

gulp.task('dev', ['browserSync', 'sass'], function() {
    // Reloads the browser whenever CSS, HTML or JS files change
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('scripts/**/*.js', browserSync.reload);
});
