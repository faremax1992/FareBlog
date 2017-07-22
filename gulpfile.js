var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  autoprefix = require('gulp-autoprefixer'),
  clearCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  imagemin = require('gulp-imagemin');


gulp.task('sass', function () {
  gulp.src('./source/css/**/*.scss')
      .pipe(autoprefix())
      .pipe(sass())
      .pipe(clearCss())
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({stream:true}));
});

gulp.task('watch', function() {
  gulp.watch('./source/css/*.scss', ['sass']);
  gulp.watch('./source/js/**/*.js', ['minifyjs']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('imagemin', function(){
    gulp.src('./source/img/*.{png,jpg,gif,ico}')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('minifyjs', function() {
        return gulp.src('./source/js/**/*.js')      //需要操作的文件
            .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
            .pipe(uglify())    //压缩
            .pipe(gulp.dest('./dist/js'));  //输出
    });

gulp.task('default', [
  'sass',
  'develop',
  'watch',
  'imagemin',
  'minifyjs'
]);
