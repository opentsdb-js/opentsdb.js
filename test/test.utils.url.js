
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Query types:
	mQuery = require( './../lib/query/metric.js' ),
	tQuery = require( './../lib/query/tsuids.js' ),

	// Client creator:
	createClient = require( './../lib/client' ),

	// Module to be tested:
	getURL = require( './../lib/utils/url.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/utils/url', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( getURL ).to.be.a( 'function' );
	});

	it( 'should throw an error if no Client instance is provided', function test() {
		expect( run ).to.throw( Error );
		function run() {
			getURL();
		}
	});


	describe( 'api/template', function tests() {

		it( 'should provide a method to generate a request URL template', function test() {
			var client = createClient(),
				url = getURL( client );

			expect( url.template ).to.be.a( 'function' );
		});

	});

	describe( 'api/create', function tests() {

		var // Settings:
			start = Date.now(),
			end = start + 1000,
			ms = false,
			arrays = false,
			tsuids = true,
			annotations = 'local',

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
			metric = 'cpu.utilization',
			ids = '0010120010,0010013100';

		function setMetricQuery( query ) {
			query.metric( metric )
				.aggregator( aggregator )
				.downsample( downsample )
				.rate( rate )
				.rateOptions({
					'counter': counter,
					'counterMax': counterMax,
					'resetValue': resetValue
				})
				.tags( 'nid', tags.nid );
		} // end FUNCTION setMetricQuery()

		function setTSUIDsQuery( query ) {
			query.tsuids( ids )
				.aggregator( aggregator )
				.downsample( downsample )
				.rate( rate )
				.rateOptions({
					'counter': counter,
					'counterMax': counterMax,
					'resetValue': resetValue
				});
		} // end FUNCTION setTSUIDsQuery()

		function setClient() {
			var client = arguments[ 0 ],
				queries = Array.prototype.slice.apply( arguments );

			client.start( start )
				.end( end )
				.ms( ms )
				.arrays( arrays )
				.tsuids( tsuids )
				.annotations( annotations );

			queries.shift();
				
			client.queries.apply( client, queries );
		} // end FUNCTION setClient()


		it( 'should provide a method to create a request URL', function test() {
			var client = createClient(),
				url = getURL( client );

			expect( url.create ).to.be.a( 'function' );
		});

		it( 'should return a request URL', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client );

			setMetricQuery( query );
			setClient( client, query );
			url = url.template()
				.create();

			assert.ok( new RegExp( '\\/api\\/query\\?' ).test( url ), 'Does not contain api query route.' );

			assert.ok( new RegExp( 'start='+start ).test( url ), 'Does not contain start time.' );

			assert.ok( new RegExp( 'end='+end ).test( url ), 'Does not contain end time.' );

			assert.ok( new RegExp( 'ms='+ms ).test( url ), 'Does not contain millisecond resolution flag.' );

			assert.ok( new RegExp( 'arrays='+arrays ).test( url ), 'Does not contain array output flag.' );

			assert.ok( new RegExp( 'show_tsuids='+tsuids ).test( url ), 'Does not contain tsuids output flag.' );

			assert.ok( new RegExp( 'no_annotations=false&global_annotations=false' ).test( url ), 'Has incorrect annotations flags' );

			assert.ok( new RegExp( '&m=' ).test( url ), 'Does not specific a metric query.' );

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
				url = getURL( client );

			setMetricQuery( query );
			query.rateOptions({'counterMax': null});

			setClient( client, query );
			url = url.template()
				.create();

			assert.ok( new RegExp( '\\{'+counter+',,'+resetValue+'\\}' ).test( url ), 'Does not contain the correct options.' );
		});

		it( 'should not return a URL which includes a rate parameter in the URL if the value is set to false', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client );

			setMetricQuery( query );
			query.rate( false );

			setClient( client, query );
			url = url.template()
				.create();

			assert.notOk( new RegExp( 'rate\\{' ).test( url ), 'Rate parameter incorrectly set.' );
		});

		it( 'should not return a URL which includes a downsample parameter if the value is set to null', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client );

			setMetricQuery( query );
			query.downsample( null );

			setClient( client, query );
			url = url.template()
				.create();

			assert.notOk( new RegExp( ':'+downsample+':' ).test( url ), 'Downsample parameter incorrectly set.' );
		});

		it( 'should include multiple queries in a single URL', function test() {
			var client = createClient(),
				query1 = mQuery(),
				query2 = mQuery(),
				url = getURL( client );

			setMetricQuery( query1 );
			setMetricQuery( query2 );
			query2.metric( 'mem.utilization' )
				.rate( false );

			setClient( client, query1, query2 );
			url = url.template()
				.create();

			assert.ok( new RegExp( query1.metric() ).test( url ), 'Does not include first query metric.' );

			assert.ok( new RegExp( 'mem.utilization' ).test( url ), 'Does not include second query metric.' );
		});

		it( 'should not return a URL which includes a tag parameter if none exist', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client );

			setMetricQuery( query );
			query.dtag( 'nid' );

			setClient( client, query );
			url = url.template()
				.create();

			assert.notOk( new RegExp( '\\{nid=' ).test( url ), 'Tags incorrectly set.' );
		});

		it( 'should properly format multiple tags', function test() {
			var client = createClient(),
				query = mQuery(),
				tags, keys,
				url = getURL( client );

			setMetricQuery( query );
			query.tags( 'foo', 'bar' );

			setClient( client, query );
			url = url.template()
				.create();

			tags = query.tags();
			keys = Object.keys( tags );

			assert.ok( new RegExp( keys[0] + '=' + tags[ keys[0] ] ).test( url ), 'Does not include tag:' + keys[0] );

			assert.ok( new RegExp( keys[1] + '=' + tags[ keys[1] ] ).test( url ), 'Does not include tag:' + keys[1] );
		});

		it( 'should not include a metric name or tags when encoding a TSUID query', function test() {
			var client = createClient(),
				query = tQuery(),
				url = getURL( client );

			setTSUIDsQuery( query );
			setClient( client, query );
			url = url.template()
				.create();

			assert.notOk( new RegExp( '&m=' ).test( url ), 'Incorrectly includes a metric query.' );

			assert.notOk( new RegExp( '\\{[A-Za-z0-9=,]+\\}$' ).test( url ), 'Incorrectly includes tags.' );

			assert.ok( new RegExp( '&tsuids=' ).test( url ), 'Does not indicate a TSUID query.' );

			assert.ok( new RegExp( ':' + ids ).test( url ), 'Does not contain TSUIDs.' );
		});

		it( 'should not include an end time if none is specified', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client );

			setMetricQuery( query );
			setClient( client, query );

			// Null the end time:
			client.end( null );
			
			url = url.template()
				.create();

			assert.notOk( new RegExp( '&end=' ).test( url ), 'Incorrectly contains an end time parameter.' );
		});

		it( 'should properly encode annotations preferences', function test() {
			var client = createClient(),
				query = mQuery(),
				url = getURL( client ),
				_url;

			setMetricQuery( query );
			setClient( client, query );

			// No annotations:
			client.annotations( 'none' );
			_url = url.template()
				.create();

			assert.ok( new RegExp( 'no_annotations=true&global_annotations=false' ).test( _url ), 'Incorrectly sets the annotations parameters for no annotations.' );

			// Local annotations:
			client.annotations( 'local' );
			_url = url.template()
				.create();

			assert.ok( new RegExp( 'no_annotations=false&global_annotations=false' ).test( _url ), 'Incorrectly sets the annotations parameters for local annotations.' );

			// All annotations:
			client.annotations( 'all' );
			_url = url.template()
				.create();

			assert.ok( new RegExp( 'no_annotations=false&global_annotations=true' ).test( _url ), 'Incorrectly sets the annotations parameters for all annotations.' );

		});

	});

});