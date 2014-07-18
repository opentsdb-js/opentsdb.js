
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Parent class:
	Uber = require( './../lib/query' ),

	// Module to be tested:
	createQuery = require( './../lib/query/metric.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'OpenTSDB client metric query', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});

	it( 'should inherit from the Query parent class', function test() {
		var query = createQuery();

		assert.ok( query instanceof Uber, 'query is not an instance of parent Query.' );
	});

	it( 'should be a method to set the metric name', function test() {
		var query = createQuery();
		expect( query.metric ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string metric name', function test() {
		var query = createQuery(),
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
				query.metric( value );
			};
		}
	});

	it( 'should set the metric name', function test() {
		var query = createQuery();
		query.metric( 'cpu.utilization' );
		assert.strictEqual( query.metric(), 'cpu.utilization' );
	});

});