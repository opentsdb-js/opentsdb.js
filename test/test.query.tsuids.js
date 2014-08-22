
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Parent class:
	Uber = require( 'opentsdb-query' ),

	// Module to be tested:
	createQuery = require( './../lib/query/tsuids.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/query/tsuids', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});

	it( 'should inherit from the Query parent class', function test() {
		var query = createQuery();
		assert.ok( query instanceof Uber, 'query is not an instance of parent Query' );
	});

	it( 'should have a type attribute', function test() {
		var query = createQuery();
		assert.strictEqual( query.type.toLowerCase(), 'tsuids' );
	});

	it( 'should not support a tags method', function test() {
		var query = createQuery();
		expect( query.tags ).to.throw( Error );
	});

	it( 'should not support a delete tag method', function test() {
		var query = createQuery();
		expect( query.dtag ).to.throw( Error );
	});

	it( 'should be provide a method to set TSUIDs', function test() {
		var query = createQuery();
		expect( query.tsuids ).to.be.a( 'function' );
	});

	it( 'should not set the list of TSUIDs if provided an invalid argument', function test() {
		var query = createQuery(),
			values = [
				5,
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
				query.tsuids( value );
			};
		}
	});

	it( 'should set the list of TSUIDs', function test() {
		var query = createQuery(),
			tsuids;

		// As a string...
		tsuids = '1,2,3,4';
		query.tsuids( tsuids );
		assert.deepEqual( query.tsuids(), tsuids.split( ',' ) );

		// As an array...
		tsuids = ['1', '2', '3', '4' ];
		query.tsuids( tsuids );
		assert.deepEqual( query.tsuids(), tsuids );
	});

	it( 'should return the list of TSUIDs as an array', function test() {
		var query = createQuery(),
			tsuids;

		// As a string...
		tsuids = '1,2,3,4';
		query.tsuids( tsuids );
		assert.isArray( query.tsuids() );
	});

});