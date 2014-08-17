/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to get OpenTSDB version info.
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

	// Get the OpenTSDB version:
	client.version( function onResponse( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( 'VERSION: ' + JSON.stringify( data ) );
	});

	/**
	* Returns (will depend on the running OpenTSDB):
	*
	*	{"timestamp":"1362712695",...,"version":"2.0.0"}
	*/

})();