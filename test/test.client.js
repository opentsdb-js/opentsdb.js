
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// TSDB server:
	tsdb = require( './utils/tsdb_server.js' ),

	// Module to be tested:
	createClient = require( './../lib/client' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'OpenTSDB client', function tests() {
	'use strict';

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


	// MILLISECOND RESOLUTION //

	it( 'should provide a millisecond resolution method', function test() {
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


	// OUTPUT AS ARRAY //

	it( 'should provide an array output method', function test() {
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


	// TSUIDS //

	it( 'should provide a TSUIDs output method', function test() {
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


	// START //

	it( 'should provide a query start time method', function test() {
		var client = createClient();
		expect( client.start ).to.be.a( 'function' );
	});

	it( 'should not allow invalid start times' );

	it( 'should provide a method to set the query start time' );


	// END //

	it( 'should provide a method to specify a query end time', function test() {
		var client = createClient();
		expect( client.end ).to.be.a( 'function' );
	});

	it( 'should not allow invalid end times' );

	it( 'should provide a method to set the query end time' );


	// QUERIES //

	it( 'should provide a queries method', function test() {
		var client = createClient();
		expect( client.queries ).to.be.a( 'function' );
	});

	it( 'should only allow metric or tsuid query instances to be set as queries' );


	// GET //

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

	it( 'should throw an error if a start time has not been provided when attempting to get data', function test() {
		var client = createClient();
		expect( run ).to.throw( Error );
		function run() {
			client.get( function(){} );
		}
	});

	it( 'should throw an error if queries have not been provided when attempting to get data', function test() {
		var client = createClient();
		client.start( Date.now() );
		expect( run ).to.throw( Error );
		function run() {
			client.get( function(){} );
		}
	});

});