var gulp = require('gulp')
var babel = require('gulp-babel')
var rename = require('gulp-rename')
var insert = require('gulp-insert')
var standard = require('gulp-standard')

gulp.task('default', ['standard'], function () {
  return gulp.src(['index.es6.js'])
    .pipe(babel({
      presets: ['es2015', 'es2015-loose', 'stage-2'],
      plugins: ['remove-comments']
    }))
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.es6', '')
    }))
    .pipe(insert.prepend('// This is an entirely generated file, please do not modify it directly. Modify the source .es6.js file and run the gulp task'))
    .pipe(gulp.dest('./'))
})

gulp.task('standard', function () {
  return gulp.src(['./**/*.es6.js', '!./node_modules/**/*'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})
