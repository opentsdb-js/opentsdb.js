/**
*
*	OPENTSDB: Socket
*
*
*	DESCRIPTION:
*		- Factory for OpenTSDB TCP socket connectors.
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
*		- 2014/08/19: Created. [AReines].
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

	var // Event emitter:
		EventEmitter = require( 'events' ).EventEmitter,

		// TCP connections:
		net = require( 'net' );


	// SOCKET //

	/**
	* FUNCTION: Socket()
	*	OpenTSDB TCP socket contructor.
	*
	* @constructor
	* @returns {Socket} Socket instance
	*/
	function Socket() {
		EventEmitter.call( this );

		this._host = '127.0.0.1'; // localhost
		this._port = 4242; // default OpenTSDB port

		// Type checking flag when writing to the socket:
		this._flg = true;

		this._socket = null;

		return this;
	} // end FUNCTION Socket()

	/**
	* Create a prototype which inherits from the parent prototype.
	*/
	Socket.prototype = Object.create( EventEmitter.prototype );

	/**
	* Set the constructor.
	*/
	Socket.prototype.constructor = Socket;

	/**
	* METHOD: host( url )
	*	Host URL setter and getter. If a URL is supplied, sets the host URL. If no URL is supplied, returns the host URL.
	*
	* @param {String} [url] - host URL
	* @returns {Socket|String} Socket instance or host URL
	*/
	Socket.prototype.host = function( url ) {
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
	* @returns {Socket|Number} Socket instance or port
	*/
	Socket.prototype.port = function( port ) {
		if ( !arguments.length ) {
			return this._port;
		}
		if ( typeof port !== 'number' || port !== port ) {
			throw new Error( 'port()::invalid input argument. Port must be a number.' );
		}
		this._port = port;
		return this;
	}; // end METHOD port()

	/**
	* METHOD: connect()
	*	Establishes a TCP socket with OpenTSDB.
	*
	* @returns {Socket} Socket instance
	*/
	Socket.prototype.connect = function() {
		this._socket = new net.Socket();

		// Setup socket event forwarding:
		this._socket.on( 'connect', this.emit.bind( this, 'connect' ) );
		this._socket.on( 'error', this.emit.bind( this, 'error' ) );
		this._socket.on( 'close', this.emit.bind( this, 'close' ) );

		// Clear the socket reference when the socket closes:
		this._socket.on( 'close', function() {
			this._socket = null;
		});

		// Create the connection:
		this._socket.connect( this._port, this._host );

		return this;
	}; // end METHOD connect()

	/**
	* METHOD: write( str, [clbk] )
	*	Writes data to the socket stream. NOTE: this method does not include type checking. Ensure that you have proper input arguments.
	*
	* @param {String} str - string to write
	* @param {Function} [clbk] - callback to invoke after writing data.
	* @returns {Socket} Socket instance
	*/
	Socket.prototype.write = function( str, clbk ) {
		/*
		if ( !this._socket ) {
			throw new Error( 'write()::cannot write. No socket connection.' );
		}
		if ( typeof str !== 'string' ) {
			throw new Error( 'write()::invalid input argument. First argument must be a string.' );
		}
		if ( arguments.length > 1 ) {
			if ( typeof clbk !== 'function' ) {
				throw new Error( 'write()::invalid input argument. Second argument must be a function.' );
			}
		}
		*/
		this._socket.write.apply( this._socket, arguments );
		return this;
	}; // end METHOD write()

	/**
	* METHOD: end()
	*	Closes a socket connection.
	*
	* @returns {Socket} Socket instance
	*/
	Socket.prototype.end = function() {
		this._socket.end();
		this._socket = null;
		return this;
	}; // end METHOD end()


	// EXPORTS //

	module.exports = function newSocket(){
		return new Socket();
	};

})();