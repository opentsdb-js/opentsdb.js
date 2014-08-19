
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Event Emitter:
	EventEmitter = require( 'events' ).EventEmitter,

	// Utility module to create a mock OpenTSDB TCP server:
	createServer = require( './utils/tcp_server.js' ),

	// Module to be tested:
	createSocket = require( './../lib/socket' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/socket', function tests() {
	'use strict';

	// SETUP //

	var SERVER,
		ADDRESS;

	before( function setup( done ) {
		SERVER = createServer();
		SERVER.on( 'listening', function onListen() {
			ADDRESS = SERVER.address();
			done();
		});
	});

	// TEARDOWN //

	after( function teardown() {
		SERVER.close();
	});


	// TESTS //

	it( 'should export a factory function', function test() {
		expect( createSocket ).to.be.a( 'function' );
	});

	it( 'should generate an event emitter', function test() {
		var socket = createSocket();

		assert.ok( socket instanceof EventEmitter );
	});

	describe( 'host', function tests() {

		it( 'should provide a method to set/get the OpenTSDB host', function test() {
			var socket = createSocket();
			expect( socket.host ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string host', function test() {
			var socket = createSocket(),
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
					socket.host( value );
				};
			}
		});

		it( 'should set the host', function test() {
			var socket = createSocket();
			socket.host( '192.168.1.172' );
			assert.strictEqual( socket.host(), '192.168.1.172' );
		});

	}); // end TESTS host

	describe( 'port', function tests() {

		it( 'should provide a method to set/get the OpenTSDB port', function test() {
			var socket = createSocket();
			expect( socket.port ).to.be.a( 'function' );
		});

		it( 'should not allow a non-numeric port', function test() {
			var socket = createSocket(),
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
					socket.port( value );
				};
			}
		});

		it( 'should set the port', function test() {
			var socket = createSocket();
			socket.port( 1337 );
			assert.strictEqual( socket.port(), 1337 );
		});

	}); // end TESTS port

	describe( 'connect', function tests() {

		it( 'should provide a method to create a socket connection', function test() {
			var socket = createSocket();
			expect( socket.connect ).to.be.a( 'function' );
		});

		it( 'should create a socket connection', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				assert.ok( true );
				socket.end();
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();
		});

	}); // end TESTS connect()

	describe( 'write', function tests() {

		it( 'should provide a method to write to the socket stream', function test() {
			var socket = createSocket();
			expect( socket.write ).to.be.a( 'function' );
		});

		it( 'should write to the socket stream', function test( done ) {
			var socket = createSocket(),
				expected;

			expected = 'put cpu.utilization ' + Date.now() + ' ' + Math.random() + ' beep=boop foo=bar\n';

			// Configure the server:
			SERVER.on( 'connection', function onSocket( sSocket ) {
				sSocket.on( 'data', function onData( actual ) {
					assert.strictEqual( actual.toString(), expected );
					socket.end();
					done();
				});
			});

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				socket.write( expected );
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();
		});

	}); // end TESTS write()

	describe( 'end', function tests() {

		it( 'should provide a method to end a socket connection', function test() {
			var socket = createSocket();
			expect( socket.end ).to.be.a( 'function' );
		});

		it( 'should end a socket connection', function test( done ) {
			var socket = createSocket();

			// Configure the socket:
			socket.on( 'connect', function onConnect() {
				socket.end();
			});

			socket.on( 'close', function onClose( flg ) {
				if ( flg ) {
					assert.ok( false, 'Socket closed due to an error.' );
					done();
					return;
				}
				assert.ok( true );
				done();
			});

			// Create a client socket connection:
			socket
				.host( ADDRESS.address )
				.port( ADDRESS.port )
				.connect();
		});

	}); // end TESTS end()

});