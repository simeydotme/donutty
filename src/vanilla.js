// ie9+

( function( Donutty ) {

    var doc = document,
        initialise = function() {

            var $donuts = document.querySelectorAll( "[data-donutty]" );

            Array.prototype.forEach.call( $donuts , function( $el ) {

                new Donutty( $el );

            });

        };


    if ( doc.readyState === "complete" || ( doc.readyState !== "loading" && !doc.documentElement.doScroll ) ) {
        initialise();
    } else {
        doc.addEventListener("DOMContentLoaded", initialise );
    }

}( Donutty ));
