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
		Uber = require( './' );


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
	

	// EXPORTS //

	module.exports = function newQuery(){
		return new Query();
	};

})();