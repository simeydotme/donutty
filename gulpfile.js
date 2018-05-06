
var gulp = require( "gulp" ),
    concat = require( "gulp-concat" );

gulp.task( "vanilla", function() {

  gulp.src( ["./src/donutty.js", "./src/vanilla.js"] )
    .pipe( concat( "donutty.js" ) )
    .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "jquery", function() {

  gulp.src( ["./src/donutty.js", "./src/jquery.js"] )
    .pipe( concat( "donutty-jquery.js" ) )
    .pipe( gulp.dest( "./dist" ) );

});

gulp.task( "default", [ "vanilla", "jquery" ]);
