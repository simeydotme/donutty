// ie9+

( function( Donutty ) {

    document.addEventListener("DOMContentLoaded", function() {

        var $donuts = document.querySelectorAll( "[data-donutty]" );

        Array.prototype.forEach.call( $donuts , function( $el ) {

            var options = JSON.parse( JSON.stringify( $el.dataset ) ),
                instance = new Donutty( $el, options );

            $el.dataset.donutty = instance;

        });

    });

}( Donutty ));
