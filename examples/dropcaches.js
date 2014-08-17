/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to instruct OpenTSDB to purge its in-memory caches.
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

	// Instruct OpenTSDB to purge its in-memory cache:
	client.dropcaches( function onResponse( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( 'RESPONSE: ' + JSON.stringify( data ) );
	});

	/**
	* Returns:
	*
	*	{"message":"Caches dropped","status":200}
	*/

})();