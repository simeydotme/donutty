
var gulp = require( "gulp" ),
    concat = require( "gulp-concat" ),
    eslint = require( "gulp-eslint" ),
    header = require( "gulp-header" ),
    rename = require( "gulp-rename" ),
    uglify = require( "gulp-uglify" ),
    pkg = require( "./package.json" ),
    uglifyOpts = { output: { comments: /(^!|@preserve)/i } },
    banner;

banner = `/**
 * ${ pkg.name } // ${ pkg.description }
 * @author ${ pkg.author.name } <${ pkg.author.email }>
 * @version ${ pkg.version }
 * @license ${ pkg.license }
 * @link ${ pkg.author.url }
 * @preserve
 */
`;

gulp.task( "lint", function() {

    return gulp.src([ "./src/*.js", "*.js" ])
        .pipe( eslint() )
        .pipe( eslint.format() )
        .pipe( eslint.failAfterError() );

});

gulp.task( "vanilla", [ "lint" ], function() {

    return gulp.src([ "./src/donutty.js", "./src/vanilla.js" ])
        .pipe( concat( "donutty.js" ) )
        .pipe( header( banner ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify( uglifyOpts ) )
        .pipe( rename( "donutty.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "jquery", [ "lint" ], function() {

    return gulp.src([ "./src/donutty.js", "./src/jquery.js" ])
        .pipe( concat( "donutty-jquery.js" ) )
        .pipe( header( banner ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify( uglifyOpts ) )
        .pipe( rename( "donutty-jquery.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "default", [ "lint", "vanilla", "jquery" ]);
