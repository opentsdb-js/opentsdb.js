/**
*
*	OPENTSDB: Query (metric)
*
*
*	DESCRIPTION:
*		- Metric query generator.
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
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Parent query constructor:
		Uber = require( 'opentsdb-query' );


	// QUERY //

	/**
	* FUNCTION: Query()
	*	OpenTSDB metric query constructor.
	*
	* @constructor
	* @returns {Query} Query instance
	*/
	function Query() {
		// Call the parent constructor:
		Uber.call( this );

		// Child specific properties:
		this._metric = null; // required

		// Tags:
		this._tags = {};
		
		return this;
	} // end FUNCTION Query()

	/**
	* Create a prototype which inherits from the parent prototype.
	*/
	Query.prototype = Object.create( Uber.prototype );

	/**
	* Set the constructor.
	*/
	Query.prototype.constructor = Query;

	/**
	* ATTRIBUTE: type
	*	Attribute specifying the query type.
	*/
	Query.prototype.type = 'metric';

	/**
	* METHOD: metric( metric )
	*	Query metric name setter and getter. If a metric is supplied, sets the query metric. If no metric is supplied, returns the query metric.
	*
	* @param {String} [metric] - metric name; e.g., 'cpu.utilization'
	* @returns {Query|String} Query instance or metric name
	*/
	Query.prototype.metric = function( metric ) {
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

	module.exports = function newQuery(){
		return new Query();
	};

})();