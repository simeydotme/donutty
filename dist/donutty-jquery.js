/**
 * donutty // Create SVG donut charts with Javascript
 * @author simeydotme <simey.me@gmail.com>
 * @version 1.1.3
 * @license ISC
 * @link http://simey.me
 * @preserve
 */

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
        _this.options.bg =          _this.options.bg || "rgba(70, 130, 180, 0.15)";
        _this.options.color =       _this.options.color || "mediumslateblue";
        _this.options.transition =  _this.options.transition || "all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98)";

        _this.init();

        return _this;

    };

    donutty.prototype.init = function() {

        this.state.min = this.options.min;
        this.state.max = this.options.max;
        this.state.value = this.options.value;
        this.state.bg = this.options.bg;
        this.state.color = this.options.color;

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
        this.$bg.setAttribute( "stroke", this.state.bg );
        this.$bg.setAttribute( "stroke-width", this.options.thickness + this.options.padding );
        this.$bg.setAttribute( "stroke-dasharray", values.full * values.multiplier );

        this.$donut.setAttribute( "fill", "transparent" );
        this.$donut.setAttribute( "cx", "50%" );
        this.$donut.setAttribute( "cy", "50%" );
        this.$donut.setAttribute( "r", this.options.radius );
        this.$donut.setAttribute( "stroke", this.state.color );
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

        // ensure the transition property is applied before
        // the actual properties are set, so that browser renders
        // the transition
        _this.$bg.style.transition = this.options.transition;
        _this.$donut.style.transition = this.options.transition;

        // use a short timeout (~60fps) to simulate a new
        // animation frame (not using rAF due to ie9 problems)
        window.setTimeout( function() {

            _this.$donut.setAttribute( "stroke-dashoffset", fill );
            _this.$donut.setAttribute( "stroke-dasharray", full );
            _this.$bg.setAttribute( "stroke", _this.state.bg );
            _this.$donut.setAttribute( "stroke", _this.state.color );
            _this.$donut.style.opacity = 1;

        }, 16 );

    };

    /**
     * set an individual state property for the chart
     * @param  {string}         prop the property to set
     * @param  {string/number}  val  the value of the given property
     * @return {object}              the donut instance
     * @chainable
     */
    donutty.prototype.set = function( prop, val ) {

        var values;

        if ( isDefined( prop ) && isDefined( val ) ) {

            this.state[ prop ] = val;
            values = this.getDashValues();
            this.animate( values.fill, values.full );

        }

        return this;

    };

    /**
     * set multiple state properties with an object
     * @param  {object} newState a map of properties to set
     * @return {object}          the donut instance
     * @chainable
     */
    donutty.prototype.setState = function( newState ) {

        var values;

        if ( isDefined( newState.value ) ) {
            this.state.value = newState.value;
        }

        if ( isDefined( newState.min ) ) {
            this.state.min = newState.min;
        }

        if ( isDefined( newState.max ) ) {
            this.state.max = newState.max;
        }

        if ( isDefined( newState.bg ) ) {
            this.state.bg = newState.bg;
        }

        if ( isDefined( newState.color ) ) {
            this.state.color = newState.color;
        }

        values = this.getDashValues();
        this.animate( values.fill, values.full );

        return this;

    };

}( document, window ));

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
