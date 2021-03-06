/**
*
*	DEMO
*
*
*	DESCRIPTION:
*		- Demonstrates use of an OpenTSDB client to retrieve data from OpenTSDB.
*
*
*	NOTES:
*		[1] This code will need to be tailored to the particular OpenTSDB you want to demo against. For instance, the metric name, tag name, and host need to be changed to values matching the relevant OpenTSDB endpoint.
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

	var client = db.client(),
		query = db.mquery(),
		end = Date.now() - 60000,
		start = end - 12000;

	// Configure the query:
	query
		.metric( 'cpu.utilization' )
		.aggregator( 'avg' )
		.downsample( null )
		.rate( false )
		.tags( 'tag', '*' );

	// Configure the client:
	client
		.host( '127.0.0.1' )
		.port( 4242 )
		.ms( true )
		.arrays( true )
		.tsuids( true )
		.annotations( 'none' )
		.queries( query )
		.start( start )
		.end( end );

	// Get the url:
	console.log( 'Query URL: ' + client.url() );

	/**
	* Returns:
	*
	*	http://127.0.0.1:4242/api/query?ms=true&arrays=true&show_tsuids=true&no_annotations=true&global_annotations=false&start=1406003885818&end=1406003897818&m=avg:cpu.utilization{tag=*}
	*/

	// Perform a data request:
	client.get( function onData( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( JSON.stringify( data ) );
	});

	/**
	* Returns an array of objects formatted as follows:
	*
	*	
		[
			{
				"metric":"cpu.utilization",
				"tags":{
					"tag":"1234"
				},
				"aggregateTags":[],
				"tsuids":[
					"0000T200110120202L"
				],
				"dps":[
					[1406004178774,0.734],
					[1406004180775,0.934],
					[1406004182780,0.309],
					[1406004184783,0.102],
					[1406004186785,0.384],
					[1406004188789,0.493]
				]
			}
		],
		...
	*/

})();