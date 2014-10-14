/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to get the current metrics stored in an OpenTSDB endpoint.
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

	var // OpenTSDB module:
		db = require( './../lib' );


	// SCRIPT //

	var client = db.client();

	// Configure the client:
	client
		.host( '127.0.0.1' )
		.port( 4242 );

	// Get the list of stored metrics:
	client.metrics( function onResponse( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( 'Metrics: ' + JSON.stringify( data ) );
	});

	/**
	* Returns (will depend on metrics stored in OpenTSDB):
	*
	*	["metric1","metric2","metric3",...,"metricN"]
	*/

})();