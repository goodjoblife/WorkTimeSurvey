/**
 * REQUIREMENTS
 */

/** basic **/
const gulp            = require('gulp');
const runSequence     = require('run-sequence');
const browserSync     = require('browser-sync');

/** postcss **/
const postcss         = require('gulp-postcss');
const precss          = require('precss');
const autoprefixer    = require('autoprefixer');
const lost            = require('lost');
const color_alpha     = require('postcss-color-alpha');
const color_function  = require('postcss-color-function');

/** utils **/
const sourcemaps      = require('gulp-sourcemaps');
const changed         = require('gulp-changed');
const plumber         = require('gulp-plumber');
const gutil           = require('gulp-util');
const cssnano         = require('gulp-cssnano');
const concat          = require('gulp-concat');
const uglify          = require('gulp-uglify');
const rename          = require('gulp-rename');
const del             = require('del');
const inject          = require('gulp-inject');
const foreach         = require('gulp-foreach');
const sort            = require('gulp-sort');
const babel           = require('gulp-babel');

/** views **/
var pug = require('gulp-pug');


/**
 * SETTINGS
 */

const reload = browserSync.reload;

const onError = function(error) {
	gutil.beep();
	gutil.log(gutil.colors.red('Error [' + error.plugin + ']: ' + error.message));
	this.emit('end');
};

const basePath = {
	src: 'src/',
	dest: 'public/assets/',
  static: 'public/'
};

const src  = {
	img  : basePath.src + 'img/',
	libs : basePath.src + 'js/libs/',
	js   : basePath.src + 'js/',
	css  : basePath.src + 'css/',
	views : basePath.src + 'views/'
}

const dest = {
	fonts: basePath.dest + 'fonts/',
	img  : basePath.dest + 'img/',
	js   : basePath.dest + 'js/',
	css  : basePath.dest + 'css/'
}

/**
 * SUB TASKS
 */

gulp.task('clean', function() {
	del(basePath.static);
});

gulp.task('browser-sync', function() {
	browserSync.init({
    server: {
      baseDir: basePath.static
    },
    port: 3010,
    open: false
	});

	gulp.watch(src.css + '{,**/}*.pcss', ['make:postcss']);
	gulp.watch([src.js + '**/*.js', '!src/js/plugins.concat.js'], ['compile:scripts']);
	gulp.watch(src.views + '{,**/}*.pug', ['watch:pages']);
  gulp.watch(src.img + '**/*', ['watch:img']);
});

gulp.task('make:import', function() {
	return gulp.src(src.css + '_*.pcss')
		.pipe(foreach(function(stream, file) {
			const text = file.relative.replace(/^_(.+)\.pcss$/, '$1')
			return stream
				.pipe(inject(gulp.src(src.css + text +'/**/_*.pcss', {read: false}).pipe(sort()), {
					relative: true,
					starttag: '/* inject:pcss */',
		            endtag: '/* endinject */',
					transform: function(filepath, file) {
						return '@import "' + filepath + '";';
					}
				}))
				.pipe(gulp.dest(src.css));
		}))
});

gulp.task('make:postcss', ['make:import'], function() {
	const plugins = [
		precss({
			extension: 'pcss'
		}),
		autoprefixer({
			browsers: 'last 3 iOS versions',
			cascade: false
		}),
		color_alpha(),
		color_function(),
		lost(),
	];
	return gulp.src([src.css + 'style.pcss'])
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(changed(src.css + '{,**/}*.pcss'))
		.pipe(sourcemaps.init())
		.pipe(postcss(plugins))
		.pipe(rename({extname: '.css'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(dest.css))
		.pipe(browserSync.stream());
});

gulp.task('make:plugins', function() {
	return gulp.src([
		src.libs + '**/*.js'
	])
	.pipe(concat('plugins.concat.js'))
	.pipe(gulp.dest(dest.js));
});

gulp.task('make:scripts', function() {
	return gulp.src([
		src.js + 'order/init.js',
		src.js + 'global/*',
		src.js + 'main/*'
	])
	.pipe(sourcemaps.init())
	.pipe(plumber({
		errorHandler: onError
	}))
	.pipe(babel())
	.pipe(concat('main.concat.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest(dest.js));
});

gulp.task('compile:scripts', ['make:scripts', 'make:plugins'], function() {
	return gulp.src([
  		dest.js + 'plugins.concat.js',
  		dest.js + 'main.concat.js'
  	])
  	.pipe(concat('main.js'))
  	.pipe(gulp.dest(dest.js))
  	.pipe(browserSync.stream());
});

gulp.task('minify', function() {
	gulp.src(dest.css + '*.css').pipe(cssnano()).pipe(gulp.dest(dest.css))
	gulp.src(dest.js + '*.js').pipe(uglify()).pipe(gulp.dest(dest.js))
});

gulp.task('make:pages', function buildHTML() {
  return gulp.src(src.views + '**/!(_)*.pug')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(pug({
      pretty: true,
      basedir: src.views
    }))
    .pipe(gulp.dest(basePath.static));
});

gulp.task('watch:pages', ['make:pages'], reload);

//move img to public when folder change
gulp.task('move:img', function() {
  return gulp.src(src.img + '**/*')
    .pipe(gulp.dest(dest.img));
});

gulp.task('watch:img', ['move:img'], reload);


/**
 * MAIN TASKS
 */

gulp.task('default', function() {
	runSequence('compile:scripts', ['make:postcss', 'make:pages'], 'browser-sync');
});

gulp.task('build', function() {
	runSequence('compile:scripts', ['make:postcss', 'make:pages'], 'minify');
});
