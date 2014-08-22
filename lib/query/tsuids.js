/**
*
*	OPENTSDB: Query (tsuids)
*
*
*	DESCRIPTION:
*		- TSUIDs query generator.
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

	// MODULES //

	var // Parent query constructor:
		Uber = require( 'opentsdb-query' );


	// QUERY //

	/**
	* FUNCTION: Query()
	*	OpenTSDB TSUIDs query constructor.
	*
	* @constructor
	* @returns {Query} Query instance
	*/
	function Query() {
		// Call the parent constructor:
		Uber.call( this );

		// Child specific properties:
		this._tsuids = null; // required

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
	Query.prototype.type = 'tsuids';

	/**
	* METHOD: tags()
	*	Override the parent tags method. For TSUID queries, this is not supported.
	*/
	Query.prototype.tags = function() {
		throw new Error( 'tags()::unsupported. TSUID queries do not support tags, as tags are included as part of the TSUID.' );
	}; // end METHOD tags()

	/**
	* METHOD: dtag()
	*	Override the parent dtag method. For TSUID queries, this is not supported.
	*/
	Query.prototype.dtag = function() {
		throw new Error( 'dtag()::unsupported. TSUID queries do not support tags, as tags are included as part of the TSUID.' );
	}; // end METHOD dtag()

	/**
	* METHOD: tsuids( tsuids )
	*	TSUIDs setter and getter. If TSUIDs are supplied, sets the TSUIDs. If no TSUIDs are supplied, returns the TSUIDs.
	*
	* @param {String|Array} tsuids - either a comma-delimited string or an array of TSUIDs
	* @returns {Query|Array} Query instance or TSUIDs
	*/
	Query.prototype.tsuids = function( tsuids ) {
		if ( !arguments.length ) {
			return this._tsuids.split( ',' );
		}
		if ( typeof tsuids !== 'string' && !Array.isArray( tsuids ) ) {
			throw new Error( 'tsuids()::invalid input argument. TSUIDs must be either a comma-delimited string or an array.' );
		}
		this._tsuids = ( Array.isArray(tsuids) ) ? tsuids.join(',') : tsuids;
		return this;
	}; // end METHOD tsuids()

	
	// EXPORTS //

	module.exports = function newQuery(){
		return new Query();
	};

})();