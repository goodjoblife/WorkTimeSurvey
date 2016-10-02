/* eslint indent: ["error", 4] */
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

/** svg **/
const svgSymbols = require('gulp-svg-symbols');
const svgmin     = require('gulp-svgmin');


/**
 * SETTINGS
 */

const reload = browserSync.reload;

const onError = function(error) {
    gutil.beep();
    gutil.log(gutil.colors.red('Error [' + error.plugin + ']: ' + error.message));
    this.emit('end');
};

/* eslint-disable key-spacing */

const basePath = {
    src    : 'src/',
    dest   : 'public/assets/',
    static : 'public/',
    modules: 'node_modules/',
};

const src  = {
    img   : basePath.src + 'img/',
    libs  : basePath.src + 'js/libs/',
    js    : basePath.src + 'js/',
    css   : basePath.src + 'css/',
    views : basePath.src + 'views/',
    svg   : basePath.src + 'svg/',
    svgmin: basePath.src + 'svg/min/',
};

const dest = {
    fonts: basePath.dest + 'fonts/',
    img  : basePath.dest + 'img/',
    js   : basePath.dest + 'js/',
    css  : basePath.dest + 'css/',
};

/* eslint-enable */

/**
 * SUB TASKS
 */

gulp.task('clean', function() {
    del(basePath.static);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: basePath.static,
        },
        port: 8080,
        open: false,
        notify: false,
    });

    gulp.watch(src.css + '{,**/}*.pcss', ['make:postcss']);
    gulp.watch(src.js + 'main/**/*.js', ['make:main-scripts']);
    gulp.watch(src.js + 'global/**/*.js', ['make:global-scripts']);
    gulp.watch(src.js + 'libs/**/*.js', ['make:dependencies']);
    gulp.watch(src.views + '{,**/}*.pug', ['watch:pages']);
    gulp.watch(src.img + '**/*', ['watch:img']);
    gulp.watch(src.svg + '*.svg', ['watch:svg']);
});

gulp.task('make:import', function() {
    return gulp.src(src.css + '_*.pcss')
        .pipe(foreach(function(stream, file) {
            const text = file.relative.replace(/^_(.+)\.pcss$/, '$1');
            return stream
                .pipe(inject(gulp.src(src.css + text +'/**/_*.pcss', {read: false}).pipe(sort()), {
                    relative: true,
                    starttag: '/* inject:pcss */',
                    endtag: '/* endinject */',
                    transform: function(filepath, file) {
                        return '@import "' + filepath + '";';
                    },
                }))
                .pipe(gulp.dest(src.css));
        }));
});

gulp.task('make:postcss', ['make:import'], function() {
    const plugins = [
        precss({
            extension: 'pcss',
        }),
        color_alpha(),
        color_function(),
        lost(),
    ];
    return gulp.src([src.css + 'style.pcss'])
        .pipe(plumber({
            errorHandler: onError,
        }))
        .pipe(changed(src.css + '{,**/}*.pcss'))
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(rename({extname: '.css'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.css))
        .pipe(browserSync.stream());
});

gulp.task('make:dependencies', function() {
    return gulp.src([
        basePath.modules + 'babel-polyfill/dist/polyfill.min.js',
        src.libs + 'jquery.min.js',
        src.libs + 'jquery-ui.min.js',
        src.libs + 'vue.min.js',
        src.libs + 'vue-resource.min.js',
        src.libs + 'director.min.js',
    ])
    .pipe(concat('dependencies.js'))
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.stream());
});

gulp.task('make:global-scripts', function() {
    return gulp.src([
        src.js + 'order/init.js',
        src.js + 'order/matchmedia.js',
        src.js + 'global/**/*.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(plumber({
        errorHandler: onError,
    }))
    .pipe(babel())
    .pipe(concat('global.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.stream());
});

gulp.task('make:main-scripts', function() {
    return gulp.src([
        src.js + 'main/**/*.js',
    ])
    .pipe(sourcemaps.init())
    .pipe(plumber({
        errorHandler: onError,
    }))
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest.js))
    .pipe(browserSync.stream());
});

gulp.task('minify', function() {
	gulp.src(dest.css + '*.css')
		.pipe(cssnano({
			autoprefixer: { browsers: ['firefox >= 15', 'ios >= 8', 'android >= 4.0', 'and_uc >= 9.9'], add: true }
		}))
		.pipe(gulp.dest(dest.css));
	gulp.src(dest.js + '*.js').pipe(uglify()).pipe(gulp.dest(dest.js));
});

gulp.task('make:pages', function buildHTML() {
    return gulp.src(src.views + '**/!(_)*.pug')
    .pipe(plumber({
        errorHandler: onError,
    }))
    .pipe(pug({
        pretty: true,
        basedir: src.views,
    }))
    .pipe(gulp.dest(basePath.static));
});

gulp.task('watch:pages', ['make:pages'], reload);

/* move img to public when folder change */
gulp.task('move:img', function() {
    return gulp.src(src.img + '**/*')
        .pipe(gulp.dest(dest.img));
});

gulp.task('watch:img', ['move:img'], reload);

/* svg */
gulp.task('clean:svgmin', function() {
    return del(src.svgmin);
});

gulp.task('minify:svg', function() {
    return gulp.src(src.svg + '*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest(src.svgmin));
});

gulp.task('make:sprites', function() {
    return gulp.src(src.svgmin + '*.svg')
        .pipe(svgSymbols({
            svgClassname: 'svg-icon-lib',
            templates: [
                'default-svg',
                'default-css',
            ],
        }))
        .pipe(gulp.dest(src.views + 'partials/'))
        .pipe(rename({ basename: '_' + 'sprites', extname: '.pcss'}))
        .pipe(gulp.dest(src.css + 'base/'));
});

gulp.task('build:sprites', function() {
    runSequence('clean:svgmin', 'minify:svg', 'make:sprites');
});

gulp.task('watch:svg', ['build:sprites'], reload);


/**
 * MAIN TASKS
 */

gulp.task('compile:scripts', function() {
    runSequence('make:main-scripts', 'make:global-scripts', 'make:dependencies');
});

gulp.task('default', function() {
    runSequence('compile:scripts', ['make:postcss', 'make:pages', 'move:img', 'build:sprites'], 'browser-sync');
});

gulp.task('build', function() {
    runSequence('compile:scripts', ['make:postcss', 'make:pages', 'move:img'], 'minify');
});
