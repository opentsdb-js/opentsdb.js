
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Parent class:
	Uber = require( 'opentsdb-query' ),

	// Module to be tested:
	createQuery = require( './../lib/query/metric.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/query/metric', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});

	it( 'should inherit from the Query parent class', function test() {
		var query = createQuery();

		assert.ok( query instanceof Uber, 'query is not an instance of parent Query.' );
	});

	it( 'should have a type attribute', function test() {
		var query = createQuery();
		assert.strictEqual( query.type.toLowerCase(), 'metric' );
	});

	it( 'should provide a method to set/get the metric name', function test() {
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

	// TAGS //

	describe( 'tags', function tests() {

		it( 'should provide a method to get/set tag names and values', function test() {
			var query = new Query();
			expect( query.tags ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string tag name', function test() {
			var query = new Query(),
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
					query.tags( value );
				};
			}
		});

		it( 'should not allow a non-string tag value', function test() {
			var query = new Query(),
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
					query.tags( 'tag', value );
				};
			}
		});

		it( 'should set a tag value', function test() {
			var query = new Query(),
				tag = 'foo',
				value = 'bar';
			query.tags( tag, value );
			assert.strictEqual( query.tags( tag ), value );
		});

		it( 'should return all tags', function test() {
			var query = new Query(),
				tags = {
					'tag1': 'value1',
					'tag2': 'value2'
				};

			query.tags( 'tag1', tags.tag1 );
			query.tags( 'tag2', tags.tag2 );
			assert.deepEqual( query.tags(), tags );
		});

		it( 'should return a tag value', function test() {
			var query = new Query(),
				tag = 'beep',
				value = 'boop';
			query.tags( tag, value );
			assert.strictEqual( query.tags( tag ), value );
		});

	});


	// DELETE TAG //

	describe( 'deleting a tag', function tests() {

		it( 'should provide a method to delete a tag', function test() {
			var query = new Query();
			expect( query.dtag ).to.be.a( 'function' );
		});

		it( 'should require a tag name as input', function test() {
			var query = new Query();
			expect( query.dtag ).to.throw( Error );
		});

		it( 'should not allow a non-string tag name', function test() {
			var query = new Query(),
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
					query.dtag( value );
				};
			}
		});

		it( 'should delete a tag', function test() {
			var query = new Query(),
				tag = 'tag',
				value = 'value';
			query.tags( tag, value );
			assert.strictEqual( query.tags( tag ), value );
			query.dtag( tag );
			assert.isUndefined( query.tags( tag ) );
		});

	}); // end TESTS dtag

});