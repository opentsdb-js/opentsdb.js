

(function() {
	'use strict';

	// MODULES //

	var // Express middleware:
		express = require( 'express' );


	// VARIABLES //

	var PORT = 4242,
		URL = '',
		NIDS = new Array( 10 ),
		QUERY = '';

	URL += 'http://127.0.0.1:' + PORT;

	QUERY += URL + '/api/query?';
	QUERY += 'ms=true';
	QUERY += '&';
	QUERY += 'arrays=true';
	QUERY += '&';
	QUERY += 'start=72000ms-ago';
	QUERY += '&';
	QUERY += 'end=60s-ago';
	QUERY += '&';
	QUERY += 'm=';
	QUERY += 'avg';
	QUERY += ':';
	QUERY += 'mem.utilization';
	QUERY += '{nid=1234}';

	for ( var i = 0; i < NIDS.length; i++ ) {
		NIDS[ i ] = i;
	}


	// APP //

	var app = express();


	// ROUTES //

	app.get( '/api/query', function onRequest( request, response ) {
		var metric, match, tag = '*', nids,
			data, time;

		// Metric query string is comprised of an aggregator and associated tags...
		metric = request.query.m
			.split(':')[1]
			.match( /(.*?)({|$)/ )[1];
		
		// Get the nid tag:
		match = request.query.m.match( /nid=(.*?)(,|}|$)/ );
		if ( match ) {
			tag = match[ 1 ];
		}

		// Get the nids:
		nids = tag.split( '|' );

		if ( nids[ 0 ] === '*' ) {
			nids = NIDS;
		}

		// Initialize the data:
		data = new Array( nids.length );
		time = Date.now();

		for ( var i = 0; i < nids.length; i++ ) {
			data[ i ] = {
				'metric': metric,
				'tags': {
					'nid': nids[ i ]
				},
				'aggregateTags': [],
				'dps': [ time, Math.random() ]
			};
		}

		response.send( 200, JSON.stringify( data ) );
	});


	// INIT //

	app.listen( PORT );
	app.url = URL;
	app.query = QUERY;


	// EXPORTS //

	module.exports = app;

})();