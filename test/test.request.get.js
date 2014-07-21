
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// TSDB server:
	tsdb = require( './utils/tsdb_server.js' ),

	// Module to be tested:
	getData = require( './../lib/request/get.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/request/get', function tests() {

	// SETUP //

	var URL = 'http://127.0.0.1:4242';

	// TESTS //

	it( 'should export a function', function test() {
		expect( getData ).to.be.a( 'function' );
	});

	it( 'should throw an error if its first argument is not a string', function test() {

		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( true ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );
		expect( badValue( function(){} ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				getData( value, function(){} );
			};
		}
	});

	it( 'should throw an error if its second argument is not a function', function test() {

		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( true ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );
		expect( badValue( '5' ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				getData( tsdb.url, value );
			};
		}
	});

	it( 'should be a function factory', function test() {
		expect( getData( tsdb.url, function(){} ) ).to.be.a( 'function' );
	});

	it( 'should return a 502 error if request to a remote resource returns an error', function test( done ) {
		var request, url;
		url = 'bad_protocol://bad/url';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.strictEqual( error.status, 502 );
				done();
				return;
			}
			assert.notOk( true, 'No error returned.' );
			done();
		}
	});

	it( 'should return a 404 error if request to a remote resource does not return data', function test( done ) {
		var request, url;
		url = tsdb.url + '/bad_body';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.strictEqual( error.status, 404 );
				done();
				return;
			}
			assert.notOk( true, 'No error returned.' );
			done();
		}
	});

	it( 'should return a 502 error if request to a remote resource does not return valid JSON', function test( done ) {
		var request, url;
		url = tsdb.url + '/bad_json';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.strictEqual( error.status, 502 );
				done();
				return;
			}
			assert.notOk( true, 'No error returned.' );
			done();
		}
	});

	it( 'should return a 404 error if request to a remote resource returns an empty array', function test( done ) {
		var request,  url;
		url = tsdb.url + '/no_data';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.strictEqual( error.status, 404 );
				done();
				return;
			}
			assert.notOk( true, 'No error returned.' );
			done();
		}
	});

	it( 'should not return an error if request successfully returns data', function test( done ) {
		var request, url;
		url = tsdb.url + '/good_data';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.notOk( true, 'Error returned.' );
				done();
				return;
			}
			assert.ok( true );
			done();
		}
	});

	it( 'should return data if request is successful', function test( done ) {
		var request, url;
		url = tsdb.url + '/good_data';
		request = getData( url, onResponse );
		request();
		return;
		function onResponse( error, data ) {
			if ( error ) {
				assert.notOk( true, 'Error returned.' );
				done();
				return;
			}
			if ( !data ) {
				assert.notOk( true, 'No data.' );
				done();
				return;
			}
			assert.ok( true );
			done();
		}
	});

});