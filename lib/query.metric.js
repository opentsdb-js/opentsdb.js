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

	// QUERY //

	/**
	* FUNCTION: Query()
	*	OpenTSDB metric query constructor.
	*
	* @constructor
	* @returns {Query} Query instance
	*/
	function Query() {
		// Metric:
		this._metric = null; // required

		// Operators:
		this._aggregator = null; // required
		this._downsample = null;
		this._rate = null;
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
	* METHOD: metric( metric )
	*	Query metric name setter and getter. If a metric is supplied, sets the query metric. If no metric is supplied, returns the query metric.
	*
	* @param {string} metric - metric name; e.g., 'cpu.utilization'
	* @returns {Client|string} Client instance or metric name
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
	* METHOD: aggregator( aggregator )
	*	Query aggregator setter and getter. If an aggregator is supplied, sets the query aggregator. If no aggregator is supplied, returns the query aggregator.
	*
	* @param {string} aggregator - aggregator; e.g., 'avg'
	* @returns {Client|string} Client instance or aggregator
	*/
	Query.prototype.aggregator = function( aggregator ) {
		if ( !arguments.length ) {
			return this._aggregator;
		}
		if ( typeof aggregator !== 'string' ) {
			throw new Error( 'aggregator()::invalid input argument. Metric aggregator must be a string.' );
		}
		this._aggregator = aggregator;
		return this;
	}; // end METHOD aggregator()

	/**
	* METHOD: downsample( downsample )
	*	Query downsample function setter and getter. If a downsample function is supplied, sets the query downsample function. If no downsample function is supplied, returns the query downsample function.
	*
	* @param {string} downsample - downsample function; e.g., '5m-avg'
	* @returns {Client|string} Client instance or downsample function
	*/
	Query.prototype.downsample = function( downsample ) {
		if ( !arguments.length ) {
			return this._downsample;
		}
		if ( typeof aggregator !== 'string' ) {
			throw new Error( 'downsample()::invalid input argument. Metric downsample function must be a string.' );
		}
		this._downsample = downsample;
		return this;
	}; // end METHOD downsample()
	

	// EXPORTS //

	module.exports = function newQuery(){
		return new Query();
	};

})();