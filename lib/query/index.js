/**
*
*	OPENTSDB: Query (superclass)
*
*
*	DESCRIPTION:
*		- Query generator.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/07/16: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// QUERY //

	/**
	* FUNCTION: Query()
	*	OpenTSDB query constructor.
	*
	* @constructor
	* @returns {Query} Query instance
	*/
	function Query() {
		// Operators:
		this._aggregator = 'avg'; // required; opinionated default
		this._downsample = null;
		this._rate = false; // opinionated default
		this._rateOptions = {
			'counter': false,
			'counterMax': null,
			'resetValue': 0
		};

		// Tags:
		this._tags = {};

		return this;
	} // end FUNCTION Query()

	/**
	* METHOD: aggregator( aggregator )
	*	Query aggregator setter and getter. If an aggregator is supplied, sets the query aggregator. If no aggregator is supplied, returns the query aggregator.
	*
	* @param {String} [aggregator] - aggregator; e.g., 'avg'
	* @returns {Query|String} Query instance or aggregator
	*/
	Query.prototype.aggregator = function( aggregator ) {
		if ( !arguments.length ) {
			return this._aggregator;
		}
		if ( typeof aggregator !== 'string' ) {
			throw new Error( 'aggregator()::invalid input argument. Aggregator must be a string.' );
		}
		this._aggregator = aggregator;
		return this;
	}; // end METHOD aggregator()

	/**
	* METHOD: downsample( downsample )
	*	Query downsample function setter and getter. If a downsample function is supplied, sets the query downsample function. If no downsample function is supplied, returns the query downsample function. By default, downsample is null.
	*
	* @param {String|null} [downsample] - downsample function; e.g., '5m-avg'
	* @returns {Query|String|null} Query instance or downsample function
	*/
	Query.prototype.downsample = function( downsample ) {
		if ( !arguments.length ) {
			return this._downsample;
		}
		if ( downsample !== null && typeof downsample !== 'string' ) {
			throw new Error( 'downsample()::invalid input argument. Downsample function must be a string.' );
		}
		this._downsample = downsample;
		return this;
	}; // end METHOD downsample()

	/**
	* METHOD: rate( bool )
	*	Query rate flag setter and getter. If a boolean is supplied, sets the rate flag. If no boolean is supplied, returns the rate flag.
	*
	* @param {Boolean} [bool] - rate flag
	* @returns {Query|Boolean} Query instance or rate flag
	*/
	Query.prototype.rate = function( bool ) {
		if ( !arguments.length ) {
			return this._rate;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'rate()::invalid input argument. Rate flag must be a boolean.' );
		}
		this._rate = bool;
		return this;
	}; // end METHOD rate()

	/**
	* METHOD: rateOptions( options )
	*	Query rate options setter and getter. If an options object is supplied, sets the rate options. If no options are supplied, returns the rate options. NOTE: even though the returned value is an object, this object does not correspond to the one used internally. Hence, the internal options object is not mutable.
	*
	* @param {Object} [options] - rate options object; limited to the following properties: counter, counterMax, resetValue. Counter must be a boolean flag. CounterMax must be numeric or null. ResetValue must be numeric.
	* @returns {Query|Object} Query instance or rate options
	*/
	Query.prototype.rateOptions = function( options ) {
		var opts = {},
			keys = [ 'counter', 'counterMax', 'resetValue' ],
			key,
			counter, counterMax, resetValue;
		if ( !arguments.length ) {
			for ( var i = 0; i < keys.length; i++  ) {
				key = keys[ i ];
				opts[ key ] = this._rateOptions[ key ];
			}
			return opts;
		}
		if ( typeof options !== 'object' || options === null || Array.isArray( options ) === true ) {
			throw new Error( 'rateOptions()::invalid input argument. Rate options must be an object.' );
		}
		
		counter = options.counter;
		if ( typeof counter !== 'undefined' ) {
			if ( typeof counter !== 'boolean' ) {
				throw new Error( 'rateOptions()::invalid input argument. Counter must be a boolean flag.' );
			}
			this._rateOptions.counter = counter;
		}
		
		counterMax = options.counterMax;
		if ( typeof counterMax !== 'undefined' ) {
			if ( counterMax !== null && (typeof counterMax !== 'number' || counterMax !== counterMax) ) {
				throw new Error( 'rateOptions()::invalid input argument. Counter max must be numeric.' );
			}
			this._rateOptions.counterMax = counterMax;
		}
		
		resetValue = options.resetValue;
		if ( typeof resetValue !== 'undefined' ) {
			if ( typeof resetValue !== 'number' || resetValue !== resetValue ) {
				throw new Error( 'rateOptions()::invalid input argument. ResetValue must be numeric.' );
			}
			this._rateOptions.resetValue = resetValue;
		}

		return this;
	}; // end METHOD rateOptions()

	/**
	* METHOD: tags( tag, value )
	*	Tag value setter and getter. If a value is supplied, sets the tag value. If no value is supplied, gets the tag value. If the tag name has not been set, getting the tag value returns undefined. If no tag name-value pair is provided, returns all tags. NOTE: the returned object for all tags does not correspond to the internal object. Accordingly, the internal object should not be treated as mutable.
	*
	* @param {String} [tag] - tag name
	* @param {String} [value] - tag value; e.g., 'foo', 'foo|bar', or '*', where '*' means to request data for all tag values for a given tag name
	* @returns {Query|Object|String|undefined} Query instance, all tags, or tag value
	*/
	Query.prototype.tags = function( tag, value ) {
		var numArgs = arguments.length,
			keys = Object.keys( this._tags ),
			key,
			tags = {};
		if ( !numArgs ) {
			for ( var i = 0; i < keys.length; i++ ) {
				key = keys[ i ];
				tags[ key ] = this._tags[ key ];
			}
			return tags;
		}
		if ( typeof tag !== 'string' ) {
			throw new Error( 'tag()::invalid input argument. Tag name must be a string.' );
		}
		if ( numArgs === 1 ) {
			return this._tags[ tag ];
		}
		if ( typeof value !== 'string' ) {
			throw new Error( 'tag()::invalid input argument. Tag value must be a string.' );
		}
		this._tags[ tag ] = value;
		return this;
	}; // end METHOD tags()

	/**
	* METHOD: dtag( tag )
	*	Removes a tag.
	*
	* @param {String} tag - tag name
	* @returns {Query} Query instance
	*/
	Query.prototype.dtag = function( tag ) {
		if ( !arguments.length ) {
			throw new Error( 'dtag()::insufficient input arguments. Must provide a tag name' );
		}
		if ( typeof tag !== 'string' ) {
			throw new Error( 'dtag()::invalid input argument. Tag name must be a string.' );
		}
		delete this._tags[ tag ];
		return this;
	}; // end METHOD tag()
	

	// EXPORTS //

	module.exports = Query;

})();