var gulp        = require('gulp');
var sass        = require('gulp-sass');
var zip         = require('gulp-zip');
var browserSync = require('browser-sync').create();
var $           = require('gulp-load-plugins')();

// we'll pass in the port exposed by our Docker container as an environment variable
var port = process.env.PORT || 8080;

var sassPaths = [
  'foundation/bower_components/normalize.scss/sass',
  'foundation/bower_components/foundation-sites/scss',
  'foundation/bower_components/motion-ui/src',
	'foundation/scss/',

  'node_modules/bootstrap/scss'
];

gulp.task('serve', ['watch'], function () {
    browserSync.init({
        proxy: 'http://localhost:' + port,
        open: false,
        notify: false,
        plugins: [require('bs-console-qrcode')]
    });
});

gulp.task('watch', ['sass', 'styles'], function () {
    gulp.watch('./assets/sass/**/*.{sass,scss}', ['sass']);
    gulp.watch('./assets/css/**/*.css', ['styles']);
    gulp.watch('./**/*.hbs').on('change', browserSync.reload);
});

gulp.task('styles', function () {
    gulp.src('./assets/css/style.css')
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    return gulp.src('./assets/sass/**/style.sass')
        .pipe(sass({
			    includePaths: sassPaths,
			    outputStyle: 'compressed' // if css compressed **file size**
			  })
				.on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'));
});

gulp.task('pack', function () {
    return gulp.src([
        './**',
        '!./node_modules/**',
        '!./dist/**',
        '!node_modules',
        '!dist',
        '!gulpfile.js',
        '!foundation',
        '!boostrap'
    ])
        .pipe(zip('my-ghost-theme.zip'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['serve']);
