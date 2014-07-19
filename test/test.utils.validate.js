
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	validate = require( './../lib/utils/validate.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/utils/validate', function tests() {
	'use strict';

	it( 'should export an object', function test() {
		expect( validate ).to.be.an( 'object' );
	});


	// RELATIVE //

	it( 'should be a method to validate a relative time', function test() {
		expect( validate.relative ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string relative time', function test() {
		var values = [
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
				validate.relative( value );
			};
		}
	});

	it( 'should properly validate a relative time string', function test() {
		assert.ok( validate.relative( '72000ms-ago' ) );
		assert.ok( validate.relative( '2s-ago' ) );
		assert.ok( validate.relative( '5m-ago' ) );
		assert.ok( validate.relative( '4h-ago' ) );
		assert.ok( validate.relative( '1d-ago' ) );
		assert.ok( validate.relative( '8w-ago' ) );
		assert.ok( validate.relative( '5n-ago' ) ); // months
		assert.ok( validate.relative( '9y-ago' ) );

		assert.notOk( validate.relative( '5' ) );
		assert.notOk( validate.relative( Date.now().toString() ) );
		assert.notOk( validate.relative( '2014/07/18' ) );
	});


	// ABSOLUTE //

	it( 'should be a method to validate an absolute time', function test() {
		expect( validate.absolute ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string absolute time', function test() {
		var values = [
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
				validate.absolute( value );
			};
		}
	});

	it( 'should properly validate an absolute time string', function test() {
		assert.ok( validate.absolute( '2014/08/02' ) );
		assert.ok( validate.absolute( '2014/08/02 09:34' ) );
		assert.ok( validate.absolute( '2014/08/02-09:34' ) );
		assert.ok( validate.absolute( '2014/08/02 09:34:54' ) );
		assert.ok( validate.absolute( '2014/08/02-09:34:54' ) );

		assert.notOk( validate.absolute( '5' ) );
		assert.notOk( validate.absolute( Date.now().toString() ) );
		assert.notOk( validate.absolute( '7h-ago' ) );
	});


	// TIMESTAMP //

	it( 'should be a method to validate a timestamp', function test() {
		expect( validate.timestamp ).to.be.a( 'function' );
	});

	it( 'should not allow a non-numeric timestamp', function test() {
		var values = [
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
				validate.timestamp( value );
			};
		}
	});

	it( 'should properly validate a timestamp', function test() {
		assert.ok( validate.timestamp( Date.now() ) );
		assert.ok( validate.timestamp( Math.round( Date.now()/1000 ) ) ); // seconds

		assert.notOk( validate.timestamp( 45 ) );
	});


	// FORMAT //

	it( 'should provide a method to determine the time format', function test() {
		expect( validate.format ).to.be.a( 'function' );
	});

	it( 'should not throw an error if the input time is neither a string or numeric', function test() {
		var values = [
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
				validate.format( value );
			};
		}
	});

	it( 'should identify an absolute time', function test() {
		assert.strictEqual( validate.format( '2014/08/02' ), 'absolute' );
		assert.strictEqual( validate.format( '2014/08/02 09:45' ), 'absolute' );
		assert.strictEqual( validate.format( '2014/08/02-09:45' ), 'absolute' );
		assert.strictEqual( validate.format( '2014/08/02 09:45:34' ), 'absolute' );
		assert.strictEqual( validate.format( '2014/08/02-09:45:34' ), 'absolute' );

		assert.notEqual( validate.format( Date.now() ), 'absolute' );
		assert.notEqual( validate.format( '72ms-ago' ), 'absolute' );
	});

	it( 'should identify a relative time', function test() {
		assert.strictEqual( validate.format( '8m-ago' ), 'relative' );
		
		assert.notEqual( validate.format( Date.now() ), 'relative' );
		assert.notEqual( validate.format( '2014/08/02 09:45' ), 'relative' );
	});

	it( 'should identify a timestamp', function test() {
		assert.strictEqual( validate.format( Date.now() ), 'timestamp' );
		assert.strictEqual( validate.format( Math.round( Date.now()/1000 ) ), 'timestamp' );
		
		assert.notEqual( validate.format( 45 ), 'timestamp' );
		assert.notEqual( validate.format( '8m-ago' ), 'timestamp' );
		assert.notEqual( validate.format( '2014/08/02 09:45' ), 'timestamp' );
	});

	it( 'should return undefined for an unknown time format', function test() {
		assert.isUndefined( validate.format( 'beep' ) );
	});

});