// jquery constructor

( function( Donutty, $ ) {

    if ( typeof window.$ !== "undefined" ) {

        $( function() {

            $.fn.donutty = function( options ) {

                return $( this ).each( function( k, el ) {

                    var $el = $( el ),
                        instance = new Donutty( el, $.extend( {}, $el.data(), options ) );

                    $el.data( "donutty", instance );

                });

            };

            $( "[data-donutty]" ).donutty();

        });

    } else {

        console.warn( "Can't find jQuery to attach Donutty" );

    }

}( Donutty, jQuery ));
