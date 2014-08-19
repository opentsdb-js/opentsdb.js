

(function() {
	'use strict';

	// MODULES //

	var // TCP server:
		net = require( 'net' );


	// VARIABLES //

	var PORT = 4242,
		HOST = '127.0.0.1';


	// SERVER //

	/**
	* FUNCTION: createServer()
	*	Creates a TCP server.
	*/
	function createServer() {
		var server = net.createServer();

		server.on( 'error', function onError( error ) {
			if (error.code === 'EADDRINUSE') {
				console.log( 'Address in use. Retrying in 1 second...');
				setTimeout(function () {
					server.close();
					server.listen( PORT, HOST );
				}, 1000 );
			}
		});

		server.on( 'listening', function onListen() {
			// console.log( '...server is listening on PORT: ' + PORT );
		});

		server.on( 'close', function onClose() {
			// console.log( '...server closed...' );
		});

		server.on( 'connection',  function onConnection( socket ) {

			socket.on( 'connect', function onConnect() {
				// console.log( '...socket connected...' );
			});

			socket.on( 'end', function onEnd() {
				// console.log( '...socket closed by client...' );
			});

			socket.on( 'close', function onClose() {
				// console.log( '...socket closed...' );
			});

			socket.on( 'error', function onError( error ) {
				console.error( '...socket error...' );
				console.error( error.message );
				console.error( error.stack );
			});

			socket.on( 'data', function onData( data ) {
				// console.log( data );
			});

		});

		server.listen( PORT, HOST );

		return server;
	} // end FUNCTION createServer()


	// EXPORTS //

	module.exports = createServer;

})();