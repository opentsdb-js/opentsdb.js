
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// TSDB server:
	tsdb = require( './utils/tsdb_server.js' ),

	// Module to be tested:
	createClient = require( './../lib/client.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'OpenTSDB client', function tests() {

	it( 'should export a factory function', function test() {
		expect( createClient ).to.be.a( 'function' );
	});


	// HOST //

	it( 'should provide a host method', function test() {
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


	// PORT //

	it( 'should provide a port method', function test() {
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

});