// jquery constructor

( function( Donutty, $ ) {

    if ( typeof window.$ !== "undefined" ) {

        $( function() {

            $.fn.donutty = function() {

                return $( this ).each( function() {

                    new Donutty( this, null );

                });

            };

            $( "[data-donutty]" ).donutty();

        });

    } else {

        console.warn( "Can't find jQuery to attach Donutty" );

    }

}( Donutty, jQuery ));
