// This code is based on exercise from
// https://css-tricks.com/gulp-for-beginners/

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
// useref est un utilitaire pour la concaténation de script (js,css)
var useref = require('gulp-useref');
// uglify sert à minifier du js
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
//cssnano sert à minifier du css
var cssnano = require('gulp-cssnano');
//imagemin sert a optimiser les images
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
//del sert à supprimer des fichiers
var del = require('del');
//run-sequence permet de lancer des fonctions dans un ordre déterminé
var runSequence = require('run-sequence');



// $ gulp task lancera une fois la compilation sass
gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


// $ gulp watch lancera un watcher pour la compilation sass
gulp.task('watch', ['browserSync', 'sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});


// $ gulp browserSync mettra à jour le navigateur
// en cas de changement dans le dossier app
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// $ gulp useref sert pour la concatenation et la minification css et js
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// $ gulp images sert pour l'optimisation des images
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})

//-----

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
})

// We've gone through the absolute basics of Gulp and created a workflow that's able to compile Sass into CSS while watching HTML and JS files for changes at the same time. We can run this task with the gulp command in the command line.
// We've also built a second task, build, that creates a dist folder for the production website. We compiled Sass into CSS, optimized all our assets, and copied the necessary folders into the dist folder. To run this task, we just have to type gulp build into the command line.
// Lastly, we have a clean task that clears away from the generated dist folder any image caches that are created, allowing us to remove any old files that were inadvertently kept in dist.
// We've created a robust workflow so far that's capable enough for most web developers. There's a lot more to Gulp and workflows that we can explore to make this process even better. 
