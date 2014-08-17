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

	var // Query superclass:
		Query = require( './../query' ),

		// Time format validation:
		validate = require( './../utils/validate.js' ),

		// Request URL template generator:
		getURL = require( './../utils/url.js' ),

		// Queries OpenTSDB:
		get = require( './../request/get.js' );


	// VARIABLES //

	var ANNOTATIONS = [ "none", "local", "all" ];


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
		this._ms = true;
		this._arrays = true;
		this._tsuids = false;
		this._annotations = 'none'; // ["none","local","all"]
		
		// Time:
		this._start = null; // required
		this._end = null;

		// Queries:
		this._queries = null; // required

		// URL generator:
		this._url = getURL( this );

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
			return this._ms;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'ms()::invalid input argument. Flag must be a boolean.' );
		}
		this._ms = bool;
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
			return this._arrays;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'arrays()::invalid input argument. Flag must be a boolean.' );
		}
		this._arrays = bool;
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
			return this._tsuids;
		}
		if ( typeof bool !== 'boolean' ) {
			throw new Error( 'tsuids()::invalid input argument. Flag must be a boolean.' );
		}
		this._tsuids = bool;
		return this;
	}; // end METHOD tsuids()

	/**
	* METHOD: annotations( value )
	*	Annotations output setter and getter. If a value is provided, sets the annotations option. If no value is provided, returns the flag. 
	*
	* @param {String} [value] - annotations setting: ["none","local","all"], where `all` refers to both local and global annotations
	* @returns {Client|String} Client instance or setting
	*/
	Client.prototype.annotations = function( value ) {
		if ( !arguments.length ) {
			return this._annotations;
		}
		if ( typeof value !== 'string' ) {
			throw new Error( 'annotations()::invalid input argument. Input argument must be a string.' );
		}
		value = value.toLowerCase();
		if ( ANNOTATIONS.indexOf( value ) === -1 ) {
			throw new Error( 'annotations()::invalid input argument. Input argument must be one of the following: ' + JSON.stringify( ANNOTATIONS ) + '.' );
		}
		this._annotations = value;
		return this;
	}; // end METHOD annotations()

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
		if ( !this._start ) {
			throw new Error( 'url()::not initialized. Must first specify a query start time.' );
		}
		if ( !this._queries || !this._queries.length ) {
			throw new Error( 'url()::not initialized. Must first set queries before building a URL.' );
		}
		var url = this._url
			.template()
			.create( this._start, this._end );

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

		// Get a query function:
		var fcn = get( this.url(), function onData( error, data ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, data );
		});

		// Make the request:
		fcn();

		return this;
	}; // end METHOD get()

	/**
	* METHOD: aggregators( clbk )
	*	Queries OpenTSDB and returns a list of available aggregators.
	*
	* @param {Function} clbk - callback to invoke after returning a response. Function should accept two arguments: [ error, aggregators ]. If no errors, error is null. `aggregators` is an array.
	* @returns {Client} Client instance
	*/
	Client.prototype.aggregators = function( clbk ) {
		var url, fcn;
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'aggregators()::invalid input argument. Callback must be a function.' );
		}
		url = 'http://'+this._host+':'+this._port+'/api/aggregators';

		fcn = get( url, function onResponse( error, aggregators ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, aggregators );
		});

		fcn();

		return this;
	}; // end METHOD aggregators()

	/**
	* METHOD: metrics( clbk )
	*	Queries OpenTSDB and returns a list of metrics.
	*
	* @param {Function} clbk - callback to invoke after returning a response. Function should accept two arguments: [ error, metrics ]. If no errors, error is null. `metrics` is an array.
	* @returns {Client} Client instance
	*/
	Client.prototype.metrics = function( clbk ) {
		var url, fcn;
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'metrics()::invalid input argument. Callback must be a function.' );
		}
		url = 'http://'+this._host+':'+this._port+'/api/suggest?type=metrics&max=1000000000&q=';

		fcn = get( url, function onResponse( error, metrics ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, metrics );
		});

		fcn();

		return this;
	}; // end METHOD metrics()

	/**
	* METHOD: config( clbk )
	*	Queries OpenTSDB for its current running configuration.
	*
	* @param {Function} clbk - callback to invoke after returning a response. Function should accept two arguments: [ error, config ]. If no errors, error is null. `config` is an object.
	* @returns {Client} Client instance
	*/
	Client.prototype.config = function( clbk ) {
		var url, fcn;
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'config()::invalid input argument. Callback must be a function.' );
		}
		url = 'http://'+this._host+':'+this._port+'/api/config';

		fcn = get( url, function onResponse( error, config ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, config );
		});

		fcn();

		return this;
	}; // end METHOD config()

	/**
	* METHOD: version( clbk )
	*	Queries OpenTSDB and returns its version.
	*
	* @param {Function} clbk - callback to invoke after returning a response. Function should accept two arguments: [ error, version ]. If no errors, error is null. `version` is an object.
	* @returns {Client} Client instance
	*/
	Client.prototype.version = function( clbk ) {
		var url, fcn;
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'version()::invalid input argument. Callback must be a function.' );
		}
		url = 'http://'+this._host+':'+this._port+'/api/version';

		fcn = get( url, function onResponse( error, version ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, version );
		});

		fcn();

		return this;
	}; // end METHOD version()

	/**
	* METHOD: dropcaches( clbk )
	*	Instructs OpenTSDB to purge its in-memory caches.
	*
	* @param {Function} clbk - callback to invoke after returning a response. Function should accept two arguments: [ error, body ]. If no errors, error is null. `body` is an object with `message` and `status` fields.
	* @returns {Client} Client instance
	*/
	Client.prototype.dropcaches = function( clbk ) {
		var url, fcn;
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'dropcaches()::invalid input argument. Callback must be a function.' );
		}
		url = 'http://'+this._host+':'+this._port+'/api/dropcaches';

		fcn = get( url, function onResponse( error, body ) {
			if ( error ) {
				clbk( error );
				return;
			}
			clbk( null, body );
		});

		fcn();

		return this;
	}; // end METHOD dropcaches()


	// EXPORTS //

	module.exports = function createClient(){
		return new Client();
	};

})();