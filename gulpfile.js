"use strict";

const gulp = require( "gulp" );
const concat = require( "gulp-concat" );
const eslint = require( "gulp-eslint" );
const header = require( "gulp-header" );
const rename = require( "gulp-rename" );
const uglify = require( "gulp-uglify" );
const pkg = require( "./package.json" );
const uglifyOpts = { output: { comments: /(^!|@preserve)/i } };

const date = new Date();

const banner = `/**
 * Donutty ~ ${ pkg.description }
 * ${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() }
 * @author ${ pkg.author.name } <${ pkg.author.email }>
 * @version ${ pkg.version }
 * @license ${ pkg.license }
 * @link ${ pkg.author.url }
 * @preserve
 */
`;


function lint() {

    return gulp.src([ "./src/*.js", "*.js" ])
        .pipe( eslint() )
        .pipe( eslint.format() )
        .pipe( eslint.failAfterError() );

}

function buildvanilla() {

    return gulp.src([ "./src/donutty.js", "./src/vanilla.js" ])
        .pipe( concat( "donutty.js" ) )
        .pipe( header( banner ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify( uglifyOpts ) )
        .pipe( rename( "donutty.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

}

function buildjquery() {

    return gulp.src([ "./src/donutty.js", "./src/jquery.js" ])
        .pipe( concat( "donutty-jquery.js" ) )
        .pipe( header( banner ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify( uglifyOpts ) )
        .pipe( rename( "donutty-jquery.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

}

const jquery = gulp.series( lint, buildjquery );
const vanilla = gulp.series( lint, buildvanilla );
const build = gulp.series( lint, buildjquery, buildvanilla );

exports.lint = lint;
exports.jquery = jquery;
exports.vanilla = vanilla;
exports.build = build;
exports.default = build;
