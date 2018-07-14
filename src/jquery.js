// jquery constructor

( function( Donutty, $ ) {

    if ( typeof window.$ !== "undefined" ) {

        $.fn.donutty = function( options ) {

            return $( this ).each( function( k, el ) {

                var $el = $( el ),
                    instance = new Donutty( el, $.extend( {}, $el.data(), options ) );

                $el.data( "donutty", instance );

            });

        };

        $( "[data-donutty]" ).donutty();

    }

}( Donutty, jQuery ));
