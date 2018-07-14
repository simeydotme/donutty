
(function( doc, win ) {

    function isDefined( input ) {
        return typeof input !== "undefined";
    }

    function float( input ) {
        return parseFloat( input, 10 );
    }

    function truth( input ) {
        return isDefined( input ) && ( input === true || input === "true" );
    }

    var donutty = win.Donutty = function( el, options ) {

        var _this = this;

        if ( el && typeof el === "string" ) {

            _this.$wrapper = doc.querySelectorAll( el )[0];

        } else if ( el instanceof window.HTMLElement ) {

            _this.$wrapper = el;

        } else {

            _this.$wrapper = doc.body;
            options = el;

        }

        _this.state =               {};
        _this.options =             options || {};
        _this.options.min =         isDefined( _this.options.min ) ? float( _this.options.min ) : 0;
        _this.options.max =         isDefined( _this.options.max ) ? float( _this.options.max ) : 100;
        _this.options.value =       isDefined( _this.options.value ) ? float( _this.options.value ) : 50;
        _this.options.round =       isDefined( _this.options.round ) ? truth( _this.options.round ) : true;
        _this.options.circle =      isDefined( _this.options.circle ) ? truth( _this.options.circle ) : true;
        _this.options.padding =     isDefined( _this.options.padding ) ? float( _this.options.padding ) : 4;
        _this.options.radius =      float( _this.options.radius ) || 50;
        _this.options.thickness =   float( _this.options.thickness ) || 10;
        _this.options.bg =          _this.options.bg || "#ECEFF1";
        _this.options.color =       _this.options.color || "#7E57C2";
        _this.options.transition =  _this.options.transition || "all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98)";

        _this.init();

        return _this;

    };

    donutty.prototype.init = function() {

        this.state.min = this.options.min;
        this.state.max = this.options.max;
        this.state.value = this.options.value;

        this.createFragments();

        return this;

    };

    donutty.prototype.createFragments = function() {

        var namespace = "http://www.w3.org/2000/svg",
            viewbox = this.options.radius * 2 + this.options.thickness + ( this.options.padding * 2 ),
            values = this.getDashValues(),
            rotateExtra = this.options.round ? this.options.thickness / 3 : 0,
            rotate = this.options.circle ? 90 + rotateExtra : -225;

        this.$html = doc.createDocumentFragment();
        this.$svg = doc.createElementNS( namespace, "svg" );
        this.$bg = doc.createElementNS( namespace, "circle" );
        this.$donut = doc.createElementNS( namespace, "circle" );

        this.$svg.setAttribute( "xmlns", namespace );
        this.$svg.setAttribute( "viewbox", "0 0 " + viewbox + " " + viewbox );
        this.$svg.setAttribute( "transform", "rotate( " + rotate +" )" );
        this.$svg.style.width = viewbox;
        this.$svg.style.height = viewbox;

        this.$bg.setAttribute( "cx", "50%" );
        this.$bg.setAttribute( "cy", "50%" );
        this.$bg.setAttribute( "r", this.options.radius );
        this.$bg.setAttribute( "fill", "transparent" );
        this.$bg.setAttribute( "stroke", this.options.bg );
        this.$bg.setAttribute( "stroke-width", this.options.thickness + this.options.padding );
        this.$bg.setAttribute( "stroke-dasharray", values.full * values.multiplier );

        this.$donut.setAttribute( "fill", "transparent" );
        this.$donut.setAttribute( "cx", "50%" );
        this.$donut.setAttribute( "cy", "50%" );
        this.$donut.setAttribute( "r", this.options.radius );
        this.$donut.setAttribute( "stroke", this.options.color );
        this.$donut.setAttribute( "stroke-width", this.options.thickness );
        this.$donut.setAttribute( "stroke-dashoffset", values.full );
        this.$donut.setAttribute( "stroke-dasharray", values.full );
        this.$donut.style.opacity = 0;

        if ( this.options.round ) {
            this.$bg.setAttribute( "stroke-linecap", "round" );
            this.$donut.setAttribute( "stroke-linecap", "round" );
        }

        this.$svg.appendChild( this.$bg );
        this.$svg.appendChild( this.$donut );
        this.$html.appendChild( this.$svg );
        this.$wrapper.appendChild( this.$html );

        this.animate( values.fill, values.full );

        return this;

    };

    donutty.prototype.getDashValues = function() {

        var circumference,
            percentageFilled,
            absoluteFilled,
            multiplier;

        multiplier = this.options.circle ? 1 : 0.75;
        circumference = 2 * Math.PI * this.options.radius;
        percentageFilled = ( this.state.value - this.state.min ) / ( this.state.max - this.state.min ) * 100;
        absoluteFilled = circumference - ( ( circumference * multiplier ) / 100 * percentageFilled );

        if (
            this.options.round &&
            this.options.circle &&
            percentageFilled < 100 &&
            absoluteFilled < this.options.thickness
        ) {

            // when in circle mode, if the linecaps are "round"
            // then the circle would look complete if it is actually
            // only ~97% complete, this is because the linecaps
            // overhang the stroke.

            absoluteFilled = this.options.thickness;

        }

        return {
            fill: absoluteFilled,
            full: circumference,
            multiplier: multiplier
        };

    };

    donutty.prototype.animate = function( fill, full ) {

        var _this = this;

        _this.$donut.style.transition = this.options.transition;

        window.requestAnimationFrame( function() {

            _this.$donut.setAttribute( "stroke-dashoffset", fill );
            _this.$donut.setAttribute( "stroke-dasharray", full );
            _this.$donut.style.opacity = 1;

        });

    };

    donutty.prototype.setValue = function( prop, val ) {

        var values;

        if ( isDefined( prop ) && isDefined( val ) ) {

            this.state[ prop ] = val;

        } else {

            this.state.value = prop;

        }

        values = this.getDashValues();
        this.animate( values.fill, values.full );

        return this;

    };

    donutty.prototype.setState = function( value, min, max ) {

        var values;

        if ( isDefined( value ) ) {
            this.state.value = value;
        }

        if ( isDefined( min ) ) {
            this.state.min = min;
        }

        if ( isDefined( max ) ) {
            this.state.max = max;
        }

        values = this.getDashValues();
        this.animate( values.fill, values.full );

        return this;

    };

}( document, window ));

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
