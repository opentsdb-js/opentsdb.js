/**
*
*	OPENTSDB: Datum
*
*
*	DESCRIPTION:
*		- Factory for individual OpenTSDB data points.
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
*		- 2014/08/18: Created. [AReines].
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

	// MODULES //

	var // Time format validation:
		validate = require( './../utils/validate.js' );


	// DATUM //

	/**
	* FUNCTION: Datum()
	*	OpenTSDB datum contructor.
	*
	* @constructor
	* @returns {Datum} Datum instance
	*/
	function Datum() {
		// Metric (required):
		this._metric = null;

		// Timestamp (required):
		this._timestamp = null;

		// Value (required):
		this._value = null;

		// Tags (optional):
		this._tags = {};

		return this;
	} // end FUNCTION Datum()

	/**
	* METHOD: metric( metric )
	*	Metric name setter and getter. If a metric is supplied, sets the metric name. If no metric is supplied, returns the metric name.
	*
	* @param {String} [metric] - metric name; e.g., 'cpu.utilization'
	* @returns {Datum|String} Datum instance or metric name
	*/
	Datum.prototype.metric = function( metric ) {
		if ( !arguments.length ) {
			return this._metric;
		}
		if ( typeof metric !== 'string' ) {
			throw new Error( 'metric()::invalid input argument. Metric name must be a string.' );
		}
		this._metric = metric;
		return this;
	}; // end METHOD metric()

	/**
	* METHOD: timestamp( value )
	*	Timestamp setter and getter. If a value is provided, sets the timestamp. If no value is provided, returns the timestamp.
	*
	* @param {String|Number} [value] - timestamp; may be either an absolute time string or a UNIX timestamp
	* @returns {Datum|Number} Datum instance or timestamp
	*/
	Datum.prototype.timestamp = function( value ) {
		if ( !arguments.length ) {
			return this._timestamp;
		}
		if ( typeof value !== 'string' && ( typeof value !== 'number' || value !== value ) ) {
			throw new Error( 'timestamp()::invalid input argument. Timestamp must be either a string or numeric.' );
		}
		if ( !validate.format( value ) ) {
			throw new Error( 'timestamp()::invalid input argument. Timestamp must be a valid time.' );
		}
		this._timestamp = value;
		return this;
	}; // end METHOD timestamp()

	/**
	* METHOD: value( value )
	*	Value setter and getter. If a value is supplied, sets the datum value. If no value is supplied, returns the datum value.
	*
	* @param {Number} [value] - datum value
	* @returns {Datum|Number} Datum instance or value
	*/
	Datum.prototype.value = function( value ) {
		if ( !arguments.length ) {
			return this._value;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'value()::invalid input argument. Value must be numeric.' );
		}
		this._value = value;
		return this;
	}; // end METHOD value()

	/**
	* METHOD: tags( tag, value )
	*	Tag value setter and getter. If a value is supplied, sets the tag value. If no value is supplied, gets the tag value. If the tag name has not been set, getting the tag value returns undefined. If no tag name-value pair is provided, returns all tags. NOTE: the returned object for all tags does not correspond to the internal object. Accordingly, the internal object should not be treated as mutable.
	*
	* @param {String} [tag] - tag name
	* @param {String} [value] - tag value
	* @returns {Datum|Object|String|undefined} Datum instance, all tags, or tag value
	*/
	Datum.prototype.tags = function( tag, value ) {
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
	* @returns {Datum} Datum instance
	*/
	Datum.prototype.dtag = function( tag ) {
		if ( !arguments.length ) {
			throw new Error( 'dtag()::insufficient input arguments. Must provide a tag name' );
		}
		if ( typeof tag !== 'string' ) {
			throw new Error( 'dtag()::invalid input argument. Tag name must be a string.' );
		}
		delete this._tags[ tag ];
		return this;
	}; // end METHOD tag()

	/**
	* METHOD: toString()
	*	Custom `toString()` method which serializes a datum. Format:
	*	"metric timestamp value tagk1=tagv1 tagk2=tagkN ... tagkN=tagvN"
	*
	* @returns {String} serialized datum
	*/
	Datum.prototype.toString = function() {
		var tags = this._tags,
			keys,
			numTags,
			key,
			buffer;

		if ( !this._metric ) {
			throw new Error( 'toString()::invalid datum. Datum must be assigned a `metric` name.' );
		}
		if ( !this._timestamp ) {
			throw new Error( 'toString()::invalid datum. Datum must be assigned a `timestamp`.' );
		}
		if ( !this._value ) {
			throw new Error( 'toString()::invalid datum. Datum must be assigned a `value`.' );
		}
		// Count the tags:
		keys = Object.keys( tags );
		numTags = keys.length;

		// Create a new array buffer:
		buffer = new Array( 3+numTags );
		buffer[ 0 ] = this._metric;
		buffer[ 1 ] = this._timestamp;
		buffer[ 2 ] = this._value;

		// If we have tags, process them...
		for ( var i = 0; i < numTags; i++ ) {
			key = keys[ i ];
			buffer[ i+3 ] = key + '=' + tags[ key ];
		}
		return buffer.join( ' ' );
	}; // end METHOD toString()


	// EXPORTS //

	module.exports = function newDatum(){
		return new Datum();
	};

})();