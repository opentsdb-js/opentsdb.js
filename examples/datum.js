/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates creating and serializing an OpenTSDB datapoint.
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
*		- 2014/08/18: Created. [AReines].
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

	var datum = db.datum();

	// Configure the datum:
	datum
		.metric( 'cpu.utilization' )
		.tags( 'beep', 'boop' )
		.tags( 'foo', 'bar' );

	// Give the datum a timestamp and value:
	datum
		.timestamp( Date.now() )
		.value( Math.random() );

	// Serialize the datum:
	datum.toString();

	/**
	* Returns:
	*
	*	"cpu.utilization <timestamp> <value> beep=boop foo=bar"
	*/

	// One can use a datum as a serialized datum factory...
	var data = new Array( 100 );
	for ( var i = 0; i < data.length; i++ ) {
		datum
			.timestamp( Date.now() )
			.value( Math.random() );

		data[ i ] = datum.toString();
	}

	// Convert the data to a newline delimited string:
	data = data.join( '\n' );

	console.log( data );

})();