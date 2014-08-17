/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to get the running configuration for an OpenTSDB endpoint.
*
*
*	NOTES:
*		[1] This code will need to be tailored to the particular OpenTSDB you want to demo against. For instance, the host may need to be changed to target the relevant OpenTSDB endpoint.
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/08/16: Created. [AReines].
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

	var // OpenTSDB module:
		db = require( './../lib' );


	// SCRIPT //

	var client = db.client();

	// Configure the client:
	client
		.host( '127.0.0.1' )
		.port( 4242 );

	// Get the running configuration for OpenTSDB:
	client.version( function onResponse( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( 'VERSION: ' + JSON.stringify( data ) );
	});

	/**
	* Returns (will depend on the OpenTSDB configuration):
	*
	*	{"tsd.core.auto_create_metrics":"true","tsd.core.meta.enable_realtime_ts":"false",...}
	*/

})();