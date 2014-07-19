
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	Query = require( './../lib/query' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/query', function tests() {
	'use strict';

	it( 'should export a constructor', function test() {
		expect( Query ).to.be.a( 'function' );
	});


	// AGGREGATOR //

	it( 'should provide a method to get/set the aggregator', function test() {
		var query = new Query();
		expect( query.aggregator ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string aggregator', function test() {
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
				query.aggregator( value );
			};
		}
	});

	it( 'should set the aggregator', function test() {
		var query = new Query();
		query.aggregator( 'sum' );
		assert.strictEqual( query.aggregator(), 'sum' );
	});


	// DOWNSAMPLE //

	it( 'should provide a method to get/set the downsample function', function test() {
		var query = new Query();
		expect( query.downsample ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string downsample', function test() {
		var query = new Query(),
			values = [
				5,
				[],
				{},
				true,
				undefined,
				NaN,
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				query.downsample( value );
			};
		}
	});

	it( 'should set the downsample function', function test() {
		var query = new Query();

		query.downsample( '60m-avg' );
		assert.strictEqual( query.downsample(), '60m-avg' );

		query.downsample( null );
		assert.isNull( query.downsample() );
	});


	// RATE //

	it( 'should provide a method to get/set the rate flag', function test() {
		var query = new Query();
		expect( query.rate ).to.be.a( 'function' );
	});

	it( 'should not allow a non-boolean rate', function test() {
		var query = new Query(),
			values = [
				5,
				[],
				{},
				'5',
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
				query.rate( value );
			};
		}
	});

	it( 'should set the rate flag', function test() {
		var query = new Query();
		query.rate( true );
		assert.strictEqual( query.rate(), true );
	});


	// RATE OPTIONS //

	it( 'should provide a method to get/set the rate options', function test() {
		var query = new Query();
		expect( query.rateOptions ).to.be.a( 'function' );
	});

	it( 'should not allow a non-object rate options argument', function test() {
		var query = new Query(),
			values = [
				5,
				[],
				'5',
				false,
				null,
				NaN,
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				query.rateOptions( value );
			};
		}
	});

	it( 'should not allow a non-boolean rate options counter', function test() {
		var query = new Query(),
			values = [
				5,
				[],
				{},
				'5',
				null,
				NaN,
				function(){}
			],
			options = {
				'counter': null
			};

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				options.counter = value;
				query.rateOptions( options );
			};
		}
	});

	it( 'should set the rate options counter flag', function test() {
		var query = new Query();

		query.rateOptions( {'counter': true} );
		assert.strictEqual( query.rateOptions().counter, true );

		query.rateOptions( {'counter': false} );
		assert.strictEqual( query.rateOptions().counter, false );
	});

	it( 'should not allow a non-numeric or non-null rate options counter max', function test() {
		var query = new Query(),
			values = [
				true,
				[],
				{},
				'5',
				NaN,
				function(){}
			],
			options = {
				'counterMax': null
			};

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				options.counterMax = value;
				query.rateOptions( options );
			};
		}
	});

	it( 'should set the rate options counter max', function test() {
		var query = new Query();

		query.rateOptions( {'counterMax': 5000} );
		assert.strictEqual( query.rateOptions().counterMax, 5000 );

		query.rateOptions( {'counterMax': null} );
		assert.strictEqual( query.rateOptions().counterMax, null );
	});

	it( 'should not allow a non-numeric rate options reset value', function test() {
		var query = new Query(),
			values = [
				true,
				[],
				{},
				'5',
				null,
				NaN,
				function(){}
			],
			options = {
				'resetValue': null
			};

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}

		function badValue( value ) {
			return function() {
				options.resetValue = value;
				query.rateOptions( options );
			};
		}
	});

	it( 'should set the rate options reset value', function test() {
		var query = new Query();

		query.rateOptions( {'resetValue': 5000} );
		assert.strictEqual( query.rateOptions().resetValue, 5000 );

		query.rateOptions( {'resetValue': 0} );
		assert.strictEqual( query.rateOptions().resetValue, 0 );
	});


	// TAGS //

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


	// DELETE TAG //

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

});