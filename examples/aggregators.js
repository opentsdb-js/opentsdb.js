/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to get an OpenTSDB's current list of supported aggregators.
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

	// Get the list of supported aggregators:
	client.aggregators( function onResponse( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( 'Aggregators: ' + JSON.stringify( data ) );
	});

	/**
	* Returns (depending on OpenTSDB version):
	*
	*	["min","mimmin","max","mimmax","dev","sum","avg","zimsum"]
	*/

})();