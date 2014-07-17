/**
*
*	OPENTSDB: Client
*
*
*	DESCRIPTION:
*		- OpenTSDB REST API client.
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

	var // Request module:
		request = require( 'request' ),

		// Metric query:
		mQuery = require( './query/metric.js' ),

		// TSUIDs query:
		tQuery = require( './query/tsuids.js' );


	// CLIENT //

	/**
	* FUNCTION: Client()
	*	OpenTSDB query client constructor.
	*
	* @constructor
	* @returns {Client} Client instance
	*/
	function Client() {
		this._host = '127.0.0.1'; // localhost
		this._port = 4242; // default OpenTSDB port

		// Output: (opinionated defaults)
		this._output = {
			'ms': true,
			'arrays': true,
			'tsuids': false
		};

		// Time:
		this._start = null; // required
		this._end = null;

		// Queries:
		this._queries = null; // required

		return this;
	} // end FUNCTION Client()

	/**
	* METHOD: host( url )
	*	Host URL setter and getter. If a URL is supplied, sets the host URL. If no URL is supplied, returns the host URL.
	*
	* @param {String} [url] - host URL
	* @returns {Client|String} Client instance or host URL
	*/
	Client.prototype.host = function( url ) {
		if ( !arguments.length ) {
			return this._host;
		}
		if ( typeof url !== 'string' ) {
			throw new Error( 'host()::invalid input argument. URL must be a string.' );
		}
		this._host = url;
		return this;
	}; // end METHOD host()

	/**
	* METHOD: port( port )
	*	Port setter and getter. If a port is supplied, sets the port. If no port is supplied, returns the port.
	*
	* @param {Number} [port] - TSDB port
	* @returns {Client|Number} Client instance or port
	*/
	Client.prototype.port = function( port ) {
		if ( !arguments.length ) {
			return this._port;
		}
		if ( typeof port !== 'number' || port !== port ) {
			throw new Error( 'port()::invalid input argument. Port must be a number.' );
		}
		this._port = port;
		return this;
	}; // end METHOD host()

	/**
	* METHOD: ms( bool )
	*	Millisecond resolution setter and getter. If a boolean is provided, sets the flag. If no boolean provided, returns the flag.
	*
	* @param {Boolean} [bool] - boolean flag
	* @returns {Client|Boolean} Client instance or boolean flag
	*/
	Client.prototype.ms = function( bool ) {
		if ( !arguments.length ) {
			return this._output.ms;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'ms()::invalid input argument. Flag must be a boolean.' );
		}
		this._output.ms = bool;
		return this;
	}; // end METHOD ms()

	/**
	* METHOD: arrays( bool )
	*	Array output setter and getter. If a boolean is provided, sets the flag. If no boolean provided, returns the flag.
	*
	* @param {Boolean} [bool] - boolean flag
	* @returns {Client|Boolean} Client instance or boolean flag
	*/
	Client.prototype.arrays = function( bool ) {
		if ( !arguments.length ) {
			return this._output.arrays;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'arrays()::invalid input argument. Flag must be a boolean.' );
		}
		this._output.arrays = bool;
		return this;
	}; // end METHOD arrays()

	/**
	* METHOD: tsuids( bool )
	*	TSUIDs output setter and getter. If a boolean is provided, sets the flag. If no boolean provided, returns the flag.
	*
	* @param {Boolean} [bool] - boolean flag
	* @returns {Client|Boolean} Client instance or boolean flag
	*/
	Client.prototype.tsuids = function( bool ) {
		if ( !arguments.length ) {
			return this._output.tsuids;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'tsuids()::invalid input argument. Flag must be a boolean.' );
		}
		this._output.tsuids = bool;
		return this;
	}; // end METHOD tsuids()

	/**
	* METHOD: start( value )
	*	Query start time setter and getter. If a value is provided, sets the query start time. If no value is provided, returns the query start time.
	*
	* @param {String|Number} [value] - query start time; may be either a relative time string, absolute time string, or a UNIX timestamp
	* @returns {Client|String|Number} Client instance or query start time
	*/
	Client.prototype.start = function( value ) {
		if ( !arguments.length ) {
			return this._start;
		}

		// TODO: validate time value
		if ( typeof value !== 'string' || typeof value !== 'number' ) {
			throw new Error( 'start()::invalid input argument. Start time must be a valid time.' );
		}
		this._output.start = value;
		return this;
	}; // end METHOD start()

	/**
	* METHOD: end( value )
	*	Query end time setter and getter. If a value is provided, sets the end start time. If no value is provided, returns the query end time.
	*
	* @param {String|Number} [value] - query end time; may be either a relative time string, absolute time string, or a UNIX timestamp
	* @returns {Client|String|Number} Client instance or query end time
	*/
	Client.prototype.end = function( value ) {
		if ( !arguments.length ) {
			return this._end;
		}

		// TODO: validate time value
		if ( typeof value !== 'string' || typeof value !== 'number' ) {
			throw new Error( 'end()::invalid input argument. End time must be a valid time.' );
		}
		this._output.end = value;
		return this;
	}; // end METHOD end()

	/**
	* METHOD: queries( query1[, query2, query3, ...] )
	*	OpenTSDB queries setter and getter. If queries are provided, sets the queries. If no queries are provided, returns the queries. Note: provided queries overwrite any existing queries. Additionally, returned queries are mutable. Modifying the query instances will affect all future data requests.
	*
	* @param {...Query} [query] - metric and/or TSUID queries
	* @returns {Client|Array} Client instance or queries
	*/
	Client.prototype.queries = function() {
		var numArgs = arguments.length,
			arg;
		if ( !numArgs ) {
			return this._queries;
		}
		for ( var i = 0; i < numArgs-1; i++ ) {
			arg = arguments[ i ];
			if ( !(arg instanceof mQuery) && !(arg instanceof tQuery) ) {
				throw new Error( 'queries()::invalid input argument. Provided queries must be either metric or TSUID queries.' );
			}
		}
		this._queries = Array.prototype.slice.call( arguments );
		return this;
	}; // end METHOD queries()

	/**
	* METHOD: get( clbk )
	*	Queries OpenTSDB.
	*
	* @param {Function} clbk - callback to be invoked after returning a response. Function should accept two arguments: [ error, data ]. If no errors, error is null.
	* @returns {Client} Client instance
	*/
	Client.prototype.get = function( clbk ) {
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'get()::invalid input argument. Callback must be a function.' );
		}
		if ( !this._start ) {
			throw new Error( 'get()::not initialized. Must first specify a query start time.' );
		}
		if ( !this._queries || !this._queries.length ) {
			throw new Error( 'get()::not initialized. Must first set queries before retrieving data.' );
		}

		// TODO: construct query string
		// TODO: perform request

		return this;
	}; // end METHOD get()


	// EXPORTS //

	module.exports = function createClient(){
		return new Client();
	};

})();