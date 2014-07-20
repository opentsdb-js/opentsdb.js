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

		// Query superclass:
		Query = require( './../query' ),

		// Time format validation:
		validate = require( './../utils/validate.js' );


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
	*	Query start time setter and getter. If a value is provided, sets the query start time. If no value is provided, returns the query start time. NOTE: by default, the start time is null.
	*
	* @param {String|Number} [value] - query start time; may be either a relative time string, absolute time string, or a UNIX timestamp
	* @returns {Client|String|Number|null} Client instance or query start time
	*/
	Client.prototype.start = function( value ) {
		if ( !arguments.length ) {
			return this._start;
		}
		if ( typeof value !== 'string' && ( typeof value !== 'number' || value !== value ) ) {
			throw new Error( 'start()::invalid input argument. Start time must be either a string or numeric.' );
		}
		if ( !validate.format( value ) ) {
			throw new Error( 'start()::invalid input argument. Start time must be a valid time.' );
		}
		this._start = value;
		return this;
	}; // end METHOD start()

	/**
	* METHOD: end( value )
	*	Query end time setter and getter. If a value is provided, sets the end start time. If no value is provided, returns the query end time. NOTE: setting the value to NULL means that OpenTSDB will read data from the specified start time to the time of read.
	*
	* @param {String|Number|null} [value] - query end time; a valid time may be either a relative time string, absolute time string, or a UNIX timestamp
	* @returns {Client|String|Number|null} Client instance or query end time
	*/
	Client.prototype.end = function( value ) {
		if ( !arguments.length ) {
			return this._end;
		}
		if ( value === null ) {
			this._end = value;
			return this;
		}
		if ( typeof value !== 'string' && ( typeof value !== 'number' || value !== value ) ) {
			throw new Error( 'end()::invalid input argument. End time must be either a string or numeric.' );
		}
		if ( !validate.format( value ) ) {
			throw new Error( 'end()::invalid input argument. End time must be a valid time.' );
		}
		this._end = value;
		return this;
	}; // end METHOD end()

	/**
	* METHOD: queries( query1[, query2, query3, ...] )
	*	OpenTSDB queries setter and getter. If queries are provided, sets the queries. If no queries are provided, returns the queries. Note: provided queries overwrite any existing queries. Additionally, returned queries are mutable. Modifying the query instances will affect all future data requests. By default, queries are null.
	*
	* @param {...Query} [query] - metric and/or TSUID queries
	* @returns {Client|Array|null} Client instance or queries
	*/
	Client.prototype.queries = function() {
		var numArgs = arguments.length,
			arg;
		if ( !numArgs ) {
			return this._queries;
		}
		for ( var i = 0; i < numArgs; i++ ) {
			arg = arguments[ i ];
			if ( !(arg instanceof Query) ) {
				throw new Error( 'queries()::invalid input argument. Provided queries must be Query instances.' );
			}
		}
		this._queries = Array.prototype.slice.call( arguments );
		return this;
	}; // end METHOD queries()

	/**
	* METHOD: url()
	*	Builds a request URL.
	*
	* @returns {String} request URL.
	*/
	Client.prototype.url = function() {
		var queries = this._queries,
			numQueries = queries.length,
			query,
			url = '',
			fields = '',
			tags, numTags, tag;

		if ( !this._start ) {
			throw new Error( 'url()::not initialized. Must first specify a query start time.' );
		}
		if ( !queries || !numQueries ) {
			throw new Error( 'url()::not initialized. Must first set queries before building a URL.' );
		}

		// Base query URL:
		url += 'http://' + this._host + ':' + this._port;
		url += '/api/query?';

		// Millisecond resolution:
		url += 'ms=' + this._output.ms.toString();
		url += '&';

		// Arrays output:
		url += 'arrays=' + this._output.arrays.toString();
		url += '&';

		// TSUIDs output:
		url += 'showTSUIDs=' + this._output.tsuids;
		url += '&';

		// Start time:
		url += 'start=' + this._start;
		url += '&';

		// End time:
		if ( this._end ) {
			url += 'end=' + this._end;
			url += '&';
		}

		// Queries:
		for ( var i = 0; i < numQueries; i++ ) {
			query = queries[ i ];

			if ( !query._tsuids && !query._metric ) {
				throw new Error( 'url()::invalid query. Query must either have a set metric name or list of TSUIDs.' );
			}

			fields = '';

			// Aggregator:
			fields += query._aggregator;
			fields += ':';

			// Rate?
			if ( query._rate ) {
				fields += 'rate{';

				// Counter:
				fields += query._rateOptions.counter;
				fields += ',';

				// Counter Max:
				if ( typeof query._rateOptions.counterMax === 'number' ) {
					fields += query._rateOptions.counterMax;
				}
				fields += ',';

				// Reset Value:
				fields += query._rateOptions.resetValue;
				fields += '}';
				fields += ':';
			}

			// Downsample:
			if ( query._downsample ) {
				fields += query._downsample ;
				fields += ':';
			}

			switch ( query.type ) {
				case 'tsuids':
					url += 'tsuids=' + fields + query._tsuids;
					break;
				case 'metric':
					url += 'm=' + fields + query._metric;
					tags = Object.keys( query._tags );
					numTags = tags.length;
					if ( numTags ) {
						url += '{';
						for ( var j = 0; j < tags.length; j++ ) {
							tag = tags[ j ];
							url += tag + '=' + query._tags[ tag ];
							if ( j < numTags-1 ) {
								url += ',';
							}
						}
						url += '}';
					}
					break;
			} // end SWITCH type

			if ( i < numQueries-1 ) {
				url += '&';
			}
		} // end FOR i

		return url;
	}; // end METHOD url()

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