
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	createDatum = require( './../lib/datum' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/datum', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createDatum ).to.be.a( 'function' );
	});

	describe( 'metric', function tests() {

		it( 'should provide a method to set/get the metric name', function test() {
			var datum = createDatum();
			expect( datum.metric ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string metric name', function test() {
			var datum = createDatum(),
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
					datum.metric( value );
				};
			}
		});

		it( 'should set the metric name', function test() {
			var datum = createDatum();
			datum.metric( 'cpu.utilization' );
			assert.strictEqual( datum.metric(), 'cpu.utilization' );
		});

	}); // end TESTS metric

	describe( 'timestamp', function tests() {

		it( 'should provide a method to get/set the datum timestamp', function test() {
			var datum = createDatum();
			expect( datum.timestamp ).to.be.a( 'function' );
		});

		it( 'should not allow invalid timestamp', function test() {
			var datum = createDatum(),
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
					datum.timestamp( value );
				};
			}
		});

		it( 'should set the datum timestamp', function test() {
			var datum = createDatum(),
				absolute = '2014/07/18 09:45',
				timestamp = Date.now();

			datum.timestamp( absolute );
			assert.strictEqual( datum.timestamp(), absolute );

			datum.timestamp( timestamp );
			assert.strictEqual( datum.timestamp(), timestamp );
		});

	}); // end TESTS timestamp

	describe( 'tags', function tests() {

		it( 'should provide a method to get/set tag names and values', function test() {
			var datum = createDatum();
			expect( datum.tags ).to.be.a( 'function' );
		});

		it( 'should not allow a non-string tag name', function test() {
			var datum = createDatum(),
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
					datum.tags( value );
				};
			}
		});

		it( 'should not allow a non-string tag value', function test() {
			var datum = createDatum(),
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
					datum.tags( 'tag', value );
				};
			}
		});

		it( 'should set a tag value', function test() {
			var datum = createDatum(),
				tag = 'foo',
				value = 'bar';
			datum.tags( tag, value );
			assert.strictEqual( datum.tags( tag ), value );
		});

		it( 'should return all tags', function test() {
			var datum = createDatum(),
				tags = {
					'tag1': 'value1',
					'tag2': 'value2'
				};

			datum.tags( 'tag1', tags.tag1 );
			datum.tags( 'tag2', tags.tag2 );
			assert.deepEqual( datum.tags(), tags );
		});

		it( 'should return a tag value', function test() {
			var datum = createDatum(),
				tag = 'beep',
				value = 'boop';
			datum.tags( tag, value );
			assert.strictEqual( datum.tags( tag ), value );
		});


		// DELETE TAG //

		it( 'should provide a method to delete a tag', function test() {
			var datum = createDatum();
			expect( datum.dtag ).to.be.a( 'function' );
		});

		it( 'should require a tag name as input', function test() {
			var datum = createDatum();
			expect( datum.dtag ).to.throw( Error );
		});

		it( 'should not allow a non-string tag name', function test() {
			var datum = createDatum(),
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
					datum.dtag( value );
				};
			}
		});

		it( 'should delete a tag', function test() {
			var datum = createDatum(),
				tag = 'tag',
				value = 'value';
			datum.tags( tag, value );
			assert.strictEqual( datum.tags( tag ), value );
			datum.dtag( tag );
			assert.isUndefined( datum.tags( tag ) );
		});

	}); // end TESTS tags()

	describe( 'value', function tests() {

		it( 'should provide a method to set/get the datum value', function test() {
			var datum = createDatum();
			expect( datum.value ).to.be.a( 'function' );
		});

		it( 'should not allow a non-numeric datum value', function test() {
			var datum = createDatum(),
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
					datum.value( value );
				};
			}
		});

		it( 'should set the datum value', function test() {
			var datum = createDatum(),
				value = Math.random();
			datum.value( value );
			assert.strictEqual( datum.value(), value );
		});

	}); // end TESTS value()

	describe( 'toString', function tests() {

		it( 'should provide a method to serialize a datum', function test() {
			var datum = createDatum();
			expect( datum.toString ).to.be.a( 'function' );
		});

		it( 'should throw an error if a datum is not assigned a metric name', function test() {
			var datum = createDatum(),
				timestamp = Date.now(),
				value = Math.random();

			datum
				.timestamp( timestamp )
				.value( value );

			expect( foo ).to.throw( Error );

			function foo() {
				datum.toString();
			}
		});

		it( 'should throw an error if a datum is not assigned a timestamp', function test() {
			var datum = createDatum(),
				metric = 'cpu.utilization',
				value = Math.random();

			datum
				.metric( metric )
				.value( value );

			expect( foo ).to.throw( Error );

			function foo() {
				datum.toString();
			}
		});

		it( 'should throw an error if a datum is not assigned a value', function test() {
			var datum = createDatum(),
				metric = 'cpu.utilization',
				timestamp = Date.now();

			datum
				.metric( metric )
				.timestamp( timestamp );

			expect( foo ).to.throw( Error );

			function foo() {
				datum.toString();
			}
		});

		it( 'should serialize a datum', function test() {
			var datum = createDatum(),
				metric = 'cpu.utilization',
				timestamp = Date.now(),
				value = Math.random(),
				tagk1 = 'beep',
				tagv1 = 'boop',
				tagk2 = 'foo',
				tagv2 = 'bar',
				expected;

			expected = metric + ' ' + timestamp + ' ' + value + ' ' + tagk1 + '=' + tagv1 + ' ' + tagk2 + '=' + tagv2;

			datum
				.metric( metric )
				.timestamp( timestamp )
				.value( value )
				.tags( tagk1, tagv1 )
				.tags( tagk2, tagv2 );

			assert.strictEqual( datum.toString(), expected );
		});

	}); // end TESTS toString()

});