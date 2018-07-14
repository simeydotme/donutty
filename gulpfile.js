
var gulp = require( "gulp" ),
    concat = require( "gulp-concat" ),
    rename = require( "gulp-rename" ),
    uglify = require( "gulp-uglify" ),
    eslint = require( "gulp-eslint" );

gulp.task( "lint", function() {

    return gulp.src([ "./src/*.js", "*.js" ])
        .pipe( eslint() )
        .pipe( eslint.format() )
        .pipe( eslint.failAfterError() );

});

gulp.task( "vanilla", [ "lint" ], function() {

    return gulp.src([ "./src/donutty.js", "./src/vanilla.js" ])
        .pipe( concat( "donutty.js" ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify() )
        .pipe( rename( "donutty.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "jquery", [ "lint" ], function() {

    return gulp.src([ "./src/donutty.js", "./src/jquery.js" ])
        .pipe( concat( "donutty-jquery.js" ) )
        .pipe( gulp.dest( "./dist" ) )
        .pipe( uglify() )
        .pipe( rename( "donutty-jquery.min.js" ) )
        .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "default", [ "lint", "vanilla", "jquery" ]);
