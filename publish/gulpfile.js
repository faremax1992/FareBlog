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

var shell = require('gulp-shell');
var ssh = require('gulp-ssh');
var deployConfig = require("./deploy-config");
var gulpSequence = require('gulp-sequence');
var zip = require('gulp-zip');
var through = require('through2');
var async = require('async');
var scpClient = require('scp2');
var gulpUtil = require('gulp-util');
var deploySSH = require('./deploy-ssh');


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

const PLUGIN_NAME = 'gulp-deploy ::'

// gulp.task('default', shell.task([
//   'DEBUG=express-demo:* npm start'
// ]));

gulp.task('up', function (){
   shell.task(['rm -rf publish']);
   gulpSequence('copyFile', 'zipFile', 'deploy',  function() {
       gulpUtil.log(PLUGIN_NAME, "***** Deploy Finished！！！！");
       process.exit(0);
    });
});

gulp.task('copyFile', function() {
    return gulp.src(
            [
                'node_modules/**',
                '*.json',
                '*.js',
                'app/**',
                'config/**',
                'dist/**',
                '!config.js'
            ], { base: './'})
            .pipe(gulp.dest('./publish'));
});

gulp.task('zipFile', function() {
    return gulp.src(['publish/**'], { base: './' })
            .pipe(zip('publish.zip'))
            .pipe(gulp.dest('./publish'));
});

gulp.task('deploy', function() {
    var config = deployConfig.production;
    config.deployPath = '/home/faremax/website/publish/';
    return gulp.src("publish/publish.zip", { base: './' })
            .pipe(deploySSH({
                servers: config.servers,
                dest: config.deployPath + 'publish.zip',
                logPath: 'deploy',
                shell:[ 'cd ' + config.deployPath,
                        'shopt -s extglob',
                        'rm -rf !(logs|node_modules|config.js|publish.zip)',
                        'unzip -o publish.zip',
                        'cp -rf publish/** .',
                        'rm -rf publish',
                        "rm publish.zip",
                        'npm install --production',
                        'pm2 startOrRestart pm2-start.json'],
            }));
});
