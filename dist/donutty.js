/**
 * Donutty ~ Create SVG donut charts with Javascript
 * 19/10/2022
 * @author simeydotme <simey.me@gmail.com>
 * @version 2.4.0
 * @license ISC
 * @link http://simey.me
 * @preserve
 */

(function( doc, win ) {

    var donutty,
        namespace = "http://www.w3.org/2000/svg";

    function isDefined( input ) {
        return typeof input !== "undefined";
    }

    function float( input ) {
        return parseFloat( input, 10 );
    }

    function truth( input ) {
        return isDefined( input ) && ( input === true || input === "true" );
    }

    donutty = win.Donutty = function( el, options ) {

        if ( el && typeof el === "string" ) {

            this.$wrapper = doc.querySelectorAll( el )[0];

        } else if ( el instanceof window.HTMLElement ) {

            this.$wrapper = el;

        } else {

            this.$wrapper = doc.body;
            options = el;

        }

        if ( !this.$wrapper ) {

            return this;

        }

        if ( !isDefined( options ) ) {

            options = this.getOptionsFromTag();

        }

        this.id =                  Math.random().toString(36).substr(2, 5);
        this.state =               {};
        this.options =             options || {};
        this.options.min =         isDefined( this.options.min ) ? float( this.options.min ) : 0;
        this.options.max =         isDefined( this.options.max ) ? float( this.options.max ) : 100;
        this.options.value =       isDefined( this.options.value ) ? float( this.options.value ) : 50;
        this.options.round =       isDefined( this.options.round ) ? truth( this.options.round ) : true;
        this.options.circle =      isDefined( this.options.circle ) ? truth( this.options.circle ) : true;
        this.options.padding =     isDefined( this.options.padding ) ? float( this.options.padding ) : 4;
        this.options.radius =      float( this.options.radius ) || 50;
        this.options.thickness =   float( this.options.thickness ) || 10;
        this.options.bg =          this.options.bg || "rgba(70, 130, 180, 0.15)";
        this.options.color =       this.options.color || "mediumslateblue";
        this.options.transition =  this.options.transition || "all 1.2s cubic-bezier(0.57, 0.13, 0.18, 0.98)";
        this.options.text =        isDefined( this.options.text ) ? this.options.text : false;
        this.options.title =       isDefined( this.options.title ) ? this.options.title : function() { return "Donut Chart Graphic"; };
        this.options.desc =        isDefined( this.options.desc ) ? this.options.desc : function( v ) { return "A donut chart ranging from " + v.min + " to " + v.max + " with a current value of " + v.value + "."; };
        this.options.dir =         isDefined( this.options.dir ) ? this.options.dir : false;
        this.options.anchor =      isDefined( this.options.anchor ) && this.options.anchor === "top" ? "top" : "bottom";

        if ( !this.options.dir ) {
            this.options.dir = this.$wrapper.dir;
        }

        if ( !this.options.dir ) {
            this.options.dir = document.body.parentElement.dir;
        }

        this.init();

        return this;

    };

    donutty.prototype.getOptionsFromTag = function() {

        return JSON.parse(JSON.stringify(this.$wrapper.dataset));

    };

    donutty.prototype.init = function() {

        this.$wrapper.donutty = this;

        var values;

        // create the state object from the options,
        // and then get the dash values for use in element creation
        this.createState();
        values = this.getDashValues();

        this.createSvg();
        this.createBg( values );
        this.createDonut( values );
        this.createText();
        this.createAccessibility();
        this.insertFragments( values );

        return this;

    };

    donutty.prototype.createState = function() {

        this.state.min = this.options.min;
        this.state.max = this.options.max;
        this.state.value = this.options.value;
        this.state.bg = this.options.bg;
        this.state.color = this.options.color;

        return this;

    };

    donutty.prototype.createText = function() {

        if ( typeof this.options.text === "function" ) {

            this.$text = doc.createElement( "span" );
            this.$text.setAttribute( "class", "donut-text" );
            this.$text.style.opacity = 0;
            this.updateText();

        }

        return this;

    };

    donutty.prototype.createAccessibility = function() {

        this.$title = doc.createElementNS( namespace, "title" );
        this.$title.setAttribute( "id", "chartTitle-" + this.id );
        this.$title.setAttribute( "class", "donut-title" );

        this.$desc = doc.createElementNS( namespace, "desc" );
        this.$desc.setAttribute( "id", "chartDesc-" + this.id );
        this.$desc.setAttribute( "class", "donut-desc" );
        this.updateAccessibility();

        return this;

    };

    donutty.prototype.createBg = function( values ) {

        this.$bg = doc.createElementNS( namespace, "circle" );

        this.$bg.setAttribute( "cx", "50%" );
        this.$bg.setAttribute( "cy", "50%" );
        this.$bg.setAttribute( "r", this.options.radius );
        this.$bg.setAttribute( "fill", "transparent" );
        this.$bg.setAttribute( "stroke", this.state.bg );
        this.$bg.setAttribute( "stroke-width", this.options.thickness + this.options.padding );
        this.$bg.setAttribute( "stroke-dasharray", values.full * values.multiplier );
        this.$bg.setAttribute( "class", "donut-bg" );

        if ( this.options.round ) {
            this.$bg.setAttribute( "stroke-linecap", "round" );
        }

        return this;

    };

    donutty.prototype.createDonut = function( values ) {

        this.$donut = doc.createElementNS( namespace, "circle" );

        this.$donut.setAttribute( "fill", "transparent" );
        this.$donut.setAttribute( "cx", "50%" );
        this.$donut.setAttribute( "cy", "50%" );
        this.$donut.setAttribute( "r", this.options.radius );
        this.$donut.setAttribute( "stroke", this.state.color );
        this.$donut.setAttribute( "stroke-width", this.options.thickness );
        this.$donut.setAttribute( "stroke-dashoffset", values.full );
        this.$donut.setAttribute( "stroke-dasharray", values.full );
        this.$donut.setAttribute( "class", "donut-fill" );
        this.$donut.style.opacity = 0;

        if ( this.options.round ) {
            this.$donut.setAttribute( "stroke-linecap", "round" );
        }

        return this;

    };

    donutty.prototype.createSvg = function() {

        var viewbox = this.options.radius * 2 + this.options.thickness + 1,
            rotateExtra = this.options.round ? this.options.thickness / 3 : 0,
            rotate = (this.options.circle ? 90 + rotateExtra : -225),
            scaleX = this.options.dir === "rtl" ? "-1" : "1",
            scaleY = this.options.anchor === "top" ? "-1" : "1",
            scale = scaleX + "," + scaleY;

        if ( this.options.padding >= 0 ) {
            viewbox += this.options.padding;
        }

        this.$html = doc.createDocumentFragment();
        this.$svg = doc.createElementNS( namespace, "svg" );

        this.$svg.setAttribute( "xmlns", namespace );
        this.$svg.setAttribute( "viewbox", "0 0 " + viewbox + " " + viewbox );
        this.$svg.setAttribute( "width", "100%" );
        this.$svg.setAttribute( "style", "transform: scale(" + scale + ") rotate(" + rotate + "deg)" );
        this.$svg.setAttribute( "preserveAspectRatio", "xMidYMid meet" );
        this.$svg.setAttribute( "class", "donut" );
        this.$svg.setAttribute( "role", "img" );
        this.$svg.setAttribute( "aria-labelledby", "chartTitle-" + this.id + " chartDesc-" + this.id );
        this.$svg.setAttribute( "role", "img" );

        return this;

    };

    donutty.prototype.insertFragments = function( values ) {

        this.$svg.appendChild( this.$title );
        this.$svg.appendChild( this.$desc );
        this.$svg.appendChild( this.$bg );
        this.$svg.appendChild( this.$donut );
        this.$html.appendChild( this.$svg );

        if ( this.$text ) {
            this.$html.appendChild( this.$text );
        }

        this.$wrapper.appendChild( this.$html );

        // because of a strange bug in browsers not updating
        // the "preserveAspectRatio" setting when applied programmatically,
        // we need to essentially delete the DOM fragment, and then
        // set the innerHTML of the parent so that it updates in browser.
        this.$wrapper.innerHTML = this.$wrapper.innerHTML;

        // and because we just destroyed the DOM fragment and all
        // the references to it, we now set all those references again.
        this.$svg = this.$wrapper.querySelector(".donut");
        this.$bg = this.$wrapper.querySelector(".donut-bg");
        this.$donut = this.$wrapper.querySelector(".donut-fill");
        this.$title = this.$wrapper.querySelector(".donut-title");
        this.$desc = this.$wrapper.querySelector(".donut-desc");

        if ( this.$text ) {
            this.$text = this.$wrapper.querySelector(".donut-text");
        }

        // now the references are re-set, we can go 
        // ahead and animate the element again.
        this.animate( values.fill, values.full );

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
        this.$bg.style.transition = this.options.transition;
        this.$donut.style.transition = this.options.transition;
        if ( this.$text ) {
            this.$text.style.transition = this.options.transition;
        }

        // use a short timeout (~60fps) to simulate a new
        // animation frame (not using rAF due to ie9 problems)
        window.setTimeout( function() {

            _this.$bg.setAttribute( "stroke", _this.state.bg );
            _this.$bg.style.opacity = 1;

            _this.$donut.setAttribute( "stroke-dashoffset", fill );
            _this.$donut.setAttribute( "stroke-dasharray", full );
            _this.$donut.setAttribute( "stroke", _this.state.color );
            _this.$donut.style.opacity = 1;

            if ( _this.$text ) {
                _this.$text.style.opacity = 1;
            }

        }, 16 );

    };

    /**
     * use the current state to set the text inside
     * the text element (only if option is provided);
     * @return {object} the donut instance
     */
    donutty.prototype.updateText = function() {

        if ( typeof this.options.text === "function" ) {

            this.$text.innerHTML = this.options.text( this.state );

        }

        return this;

    };

    /**
     * use the current state to set the text inside
     * the title and description for accessibility;
     * @return {object} the donut instance
     */
    donutty.prototype.updateAccessibility = function() {

        if ( typeof this.options.title === "function" ) {

            this.$title.innerHTML = this.options.title( this.state );

        } else {

            this.$title.innerHTML = this.options.title;

        }

        if ( typeof this.options.desc === "function" ) {

            this.$desc.innerHTML = this.options.desc( this.state );

        } else {

            this.$desc.innerHTML = this.options.desc;

        }

        return this;

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
            this.updateText();
            this.updateAccessibility();
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
        this.updateText();
        this.updateAccessibility();
        this.animate( values.fill, values.full );

        return this;

    };

}( document, window ));

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
