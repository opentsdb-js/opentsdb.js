
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// TSDB server:
	tsdb = require( './utils/tsdb_server.js' ),

	// Query types:
	mQuery = require( './../lib/query/metric.js' ),
	tQuery = require( './../lib/query/tsuids.js' ),

	// Module to be tested:
	createClient = require( './../lib/client' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/client', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createClient ).to.be.a( 'function' );
	});


	describe( 'api/host', function tests() {

		it( 'should provide a method to get/set a host', function test() {
			var client = createClient();
			expect( client.host ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string host', function test() {
			var client = createClient(),
				values = [
					5,
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.host( value );
				};
			}
		});

		it( 'should set the default host URL to 127.0.0.1', function test() {
			var client = createClient();

			assert.strictEqual( client.host(), '127.0.0.1' );
		});

		it( 'should provide a method to set the host URL', function test() {
			var client = createClient(),
				url = '192.168.92.175';

			client.host( url );
			assert.strictEqual( client.host(), url );
		});

	}); // end TESTS api/host


	describe( 'api/port', function tests() {

		it( 'should provide a method to get/set the port', function test() {
			var client = createClient();
			expect( client.port ).to.be.a( 'function' );
		});

		it( 'should set the default port to 4242', function test() {
			var client = createClient();

			assert.strictEqual( client.port(), 4242 );
		});

		it( 'should not allow a non-numeric port', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.port( value );
				};
			}
		});

		it( 'should provide a method to set database port', function test() {
			var client = createClient(),
				port = 4000;

			client.port( port );
			assert.strictEqual( client.port(), port );
		});

	}); // end TESTS api/port


	describe( 'api/millisecond resolution', function tests() {

		it( 'should provide a method to get/set the millisecond resolution flag', function test() {
			var client = createClient();
			expect( client.ms ).to.be.a( 'function' );
		});

		it( 'should not allow a non-boolean millisecond resolution flag', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.ms( value );
				};
			}
		});

		it( 'should provide a method to set a millisecond resolution output flag', function test() {
			var client = createClient(),
				FLG = false;

			client.ms( FLG );
			assert.strictEqual( client.ms(), FLG );
		});

	}); // end TESTS api/ms


	describe( 'api/arrays', function tests() {

		it( 'should provide a method to get/set the array output flag', function test() {
			var client = createClient();
			expect( client.arrays ).to.be.a( 'function' );
		});

		it( 'should not allow a non-boolean arrays flag', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.arrays( value );
				};
			}
		});

		it( 'should provide a method to set an arrays output flag', function test() {
			var client = createClient(),
				FLG = false;

			client.arrays( FLG );
			assert.strictEqual( client.arrays(), FLG );
		});

	}); // end TESTS api/arrays


	describe( 'api/tsuids', function tests() {

		it( 'should provide a method to get/set TSUIDs output flag', function test() {
			var client = createClient();
			expect( client.tsuids ).to.be.a( 'function' );
		});

		it( 'should not allow a non-boolean TSUIDs flag', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.tsuids( value );
				};
			}
		});

		it( 'should provide a method to set a TSUIDs output flag', function test() {
			var client = createClient(),
				FLG = false;

			client.tsuids( FLG );
			assert.strictEqual( client.tsuids(), FLG );
		});

	}); // end TESTS api/tsuids


	describe( 'api/start', function tests() {

		it( 'should provide a method to get/set the query start time', function test() {
			var client = createClient();
			expect( client.start ).to.be.a( 'function' );
		});

		it( 'should not allow invalid start times', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}
			function badValue( value ) {
				return function() {
					client.start( value );
				};
			}
		});

		it( 'should provide a method to set the query start time', function test() {
			var client = createClient(),
				relative = '72h-ago',
				absolute = '2014/07/18 09:45',
				timestamp = Date.now();

			client.start( relative );
			assert.strictEqual( client.start(), relative );

			client.start( absolute );
			assert.strictEqual( client.start(), absolute );

			client.start( timestamp );
			assert.strictEqual( client.start(), timestamp );
		});

	}); // end TESTS api/start


	describe( 'api/end', function tests() {

		it( 'should provide a method to get/set a query end time', function test() {
			var client = createClient();
			expect( client.end ).to.be.a( 'function' );
		});

		it( 'should not allow invalid end times', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					true,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}
			function badValue( value ) {
				return function() {
					client.end( value );
				};
			}
		});

		it( 'should provide a method to set the query end time', function test() {
			var client = createClient(),
				relative = '72h-ago',
				absolute = '2014/07/18 09:45',
				timestamp = Date.now();

			client.end( relative );
			assert.strictEqual( client.end(), relative );

			client.end( absolute );
			assert.strictEqual( client.end(), absolute );

			client.end( timestamp );
			assert.strictEqual( client.end(), timestamp );

			// Remove any end time specification:
			client.end( null );
			assert.isNull( client.end() );
		});

	}); // end TESTS api/end


	describe( 'api/queries', function tests() {

		it( 'should provide a method to get/set queries', function test() {
			var client = createClient();
			expect( client.queries ).to.be.a( 'function' );
		});

		it( 'should only allow metric or tsuid query instances to be set as queries', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					true,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}
			function badValue( value ) {
				return function() {
					client.queries( value );
				};
			}
		});

		it( 'should set metric or tsuid queries', function test() {
			var client = createClient(),
				query;

			// Metric query:
			query = mQuery();
			client.queries( query );
			assert.strictEqual( client.queries()[0], query );

			// TSUID query:
			query = tQuery();
			client.queries( query );
			assert.strictEqual( client.queries()[0], query );
		});

		it( 'should allow an arbitrary number of queries to be set', function test() {
			var client = createClient(),
				queries = [],
				cQueries;

			// Assemble an array of queries:
			queries[ 0 ] = mQuery();
			queries[ 1 ] = mQuery();
			queries[ 2 ] = tQuery();
			queries[ 3 ] = mQuery();
			queries[ 4 ] = tQuery();

			client.queries.apply( client, queries );
			cQueries = client.queries();
			for ( var i = 0; i < queries.length; i++ ) {
				assert.strictEqual( cQueries[ i ], queries[ i ] );
			}
		});

	}); // end TESTS api/queries


	describe( 'api/url', function tests() {

		var // Settings:
			start = Date.now(),
			end = start + 1000,
			ms = false,
			arrays = false,
			tsuids = true,

			// Query:
			aggregator = 'sum',
			downsample = '5m-avg',
			rate = true,
			counter = true,
			counterMax = 10000,
			resetValue = 5,
			tags = {
				'nid': '*'
			},
			metric = 'cpu.utilization';

		function setMetricQuery( query ) {
			query.metric( metric )
				.aggregator( aggregator )
				.downsample( downsample )
				.rate( rate )
				.rateOptions( {
					'counter': counter,
					'counterMax': counterMax,
					'resetValue': resetValue
				})
				.tags( 'nid', tags.nid );
		} // end FUNCTION setMetricQuery()

		function setClient() {
			var client = arguments[ 0 ],
				queries = Array.prototype.slice.apply( arguments );

			client.start( start )
				.end( end )
				.ms( ms )
				.arrays( arrays )
				.tsuids( tsuids );

			queries.shift();
				
			client.queries.apply( client, queries );
		} // end FUNCTION setClient()


		it( 'should provide a method to get a request URL', function test() {
			var client = createClient();
			expect( client.url ).to.be.a( 'function' );
		});

		it( 'should throw an error if a start time has not been set before attempting to build a request URL', function test() {
			var client = createClient();
			client.queries( mQuery() );
			expect( run ).to.throw( Error );
			function run() {
				client.url();
			}
		});

		it( 'should throw an error if queries have not been set before attempting to build a request URL', function test() {
			var client = createClient(),
				queries;

			client.start( Date.now() );
			expect( run ).to.throw( Error );

			client.queries( mQuery() );
			queries = client.queries();

			queries.shift();
			expect( run ).to.throw( Error );

			function run() {
				client.url();
			}
		});

		it( 'should throw an error if queries have not been initialized before attempting to build a request URL', function test() {
			var client = createClient(),
				queries;

			client.start( Date.now() );

			client.queries( mQuery() );
			expect( run ).to.throw( Error );

			client.queries( tQuery() );
			expect( run ).to.throw( Error );

			function run() {
				client.url();
			}
		});

		it( 'should return a request URL', function test() {
			var client = createClient(),
				query = mQuery(),
				url;

			setMetricQuery( query );
			setClient( client, query );
			url = client.url();

			assert.ok( new RegExp( '\\/api\\/query\\?' ).test( url ), 'Does not contain api query route.' );

			assert.ok( new RegExp( 'start='+start ).test( url ), 'Does not contain start time.' );

			assert.ok( new RegExp( 'end='+end ).test( url ), 'Does not contain end time.' );

			assert.ok( new RegExp( 'ms='+ms ).test( url ), 'Does not contain millisecond resolution flag.' );

			assert.ok( new RegExp( 'arrays='+arrays ).test( url ), 'Does not contain array output flag.' );

			assert.ok( new RegExp( 'showTSUIDs='+tsuids ).test( url ), 'Does not contain tsuids output flag.' );

			assert.ok( new RegExp( '\\&m=' ).test( url ), 'Does not specific a metric query.' );

			assert.ok( new RegExp( aggregator+':' ).test( url ), 'Does not contain aggregator.' );

			assert.ok( new RegExp( 'rate' ).test( url ), 'Does not contain a rate flag.' );

			assert.ok( new RegExp( '\\{'+counter+','+counterMax+','+resetValue+'\\}' ).test( url ), 'Does not contain the options.' );

			assert.ok( new RegExp( ':'+downsample+':' ).test( url ), 'Does not contain downsample.' );

			assert.ok( new RegExp( ':'+metric ).test( url ), 'Does not contain metric name.' );

			assert.ok( new RegExp( '\\{nid='+( (tags.nid==='*') ? '\\*' : tags.nid )+'\\}' ).test( url ), 'Does not contain tags.' + url );
		});

		it( 'should not return a URL which includes a counterMax parameter in the URL if the value is set to null', function test() {
			var client = createClient(),
				query = mQuery(),
				url;

			setMetricQuery( query );
			query.rateOptions({'counterMax': null});

			setClient( client, query );
			url = client.url();

			assert.ok( new RegExp( '\\{'+counter+',,'+resetValue+'\\}' ).test( url ), 'Does not contain the correct options.' );
		});

		it( 'should not return a URL which includes a rate parameter in the URL if the value is set to false', function test() {
			var client = createClient(),
				query = mQuery(),
				url;

			setMetricQuery( query );
			query.rate( false );

			setClient( client, query );
			url = client.url();

			assert.notOk( new RegExp( 'rate\\{' ).test( url ), 'Rate parameter incorrectly set.' );
		});

		it( 'should not return a URL which includes a downsample parameter if the value is set to null', function test() {
			var client = createClient(),
				query = mQuery(),
				url;

			setMetricQuery( query );
			query.downsample( null );

			setClient( client, query );
			url = client.url();

			assert.notOk( new RegExp( ':'+downsample+':' ).test( url ), 'Downsample parameter incorrectly set.' );
		});

		it( 'should include multiple queries in a single URL', function test() {
			var client = createClient(),
				query1 = mQuery(),
				query2 = mQuery(),
				url;

			setMetricQuery( query1 );
			setMetricQuery( query2 );
			query2.metric( 'mem.utilization' )
				.rate( false );

			setClient( client, query1, query2 );
			url = client.url();

			assert.ok( new RegExp( query1.metric() ).test( url ), 'Does not include first query metric.' );

			assert.ok( new RegExp( 'mem.utilization' ).test( url ), 'Does not include second query metric.' );
		});

		it( 'should not return a URL which includes a tag parameter if none exist', function test() {
			var client = createClient(),
				query = mQuery(),
				url;

			setMetricQuery( query );
			query.dtag( 'nid' );

			setClient( client, query );
			url = client.url();

			assert.notOk( new RegExp( '\\{nid=' ).test( url ), 'Tags incorrectly set.' );
		});

		it( 'should properly format multiple tags', function test() {
			var client = createClient(),
				query = mQuery(),
				tags, keys,
				url;

			setMetricQuery( query );
			query.tags( 'foo', 'bar' );

			setClient( client, query );
			url = client.url();

			tags = query.tags();
			keys = Object.keys( tags );

			assert.ok( new RegExp( keys[0] + '=' + tags[ keys[0] ] ).test( url ), 'Does not include tag:' + keys[0] );

			assert.ok( new RegExp( keys[1] + '=' + tags[ keys[1] ] ).test( url ), 'Does not include tag:' + keys[1] );
		});

	}); // end TESTS api/url


	describe( 'api/get', function tests() {

		it( 'should provide a method to submit a query request to TSDB', function test() {
			var client = createClient();
			expect( client.get ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided argument is not a function', function test() {
			var client = createClient(),
				values = [
					'5',
					[],
					{},
					5,
					null,
					undefined,
					NaN,
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( Error );
			}

			function badValue( value ) {
				return function() {
					client.get( value );
				};
			}
		});

		it( 'should throw an error if a start time has not been set before attempting to get data', function test() {
			var client = createClient();
			expect( run ).to.throw( Error );
			function run() {
				client.get( function(){} );
			}
		});

		it( 'should throw an error if queries have not been set before attempting to get data', function test() {
			var client = createClient(),
				queries;

			client.start( Date.now() );
			expect( run ).to.throw( Error );

			client.queries( mQuery() );
			queries = client.queries();

			// Simulate people messing with the queries array, leaving it empty:
			queries.shift();
			expect( run ).to.throw( Error );

			// NOTE: we do not get around people messing with the array by adding and removing bogus entries. *sigh*. We would have to check each query at runtime to do this. We'll act naive and belief that people will not be mischievous like that.

			function run() {
				client.get( function(){} );
			}
		});

	}); // end TESTS api/get

});