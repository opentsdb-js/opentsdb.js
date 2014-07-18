
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	createQuery = require( './../lib/query' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'OpenTSDB client query', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( createQuery ).to.be.a( 'function' );
	});


	// AGGREGATOR //

	it( 'should provide an aggregator method', function test() {
		var query = createQuery();
		expect( query.aggregator ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string aggregator', function test() {
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
				query.aggregator( value );
			};
		}
	});

	it( 'should set the aggregator', function test() {
		var query = createQuery();
		query.aggregator( 'sum' );
		assert.strictEqual( query.aggregator(), 'sum' );
	});


	// DOWNSAMPLE //

	it( 'should provide a downsample method', function test() {
		var query = createQuery();
		expect( query.downsample ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string downsample', function test() {
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
				query.downsample( value );
			};
		}
	});

	it( 'should set the downsample function', function test() {
		var query = createQuery();
		query.downsample( '60m-avg' );
		assert.strictEqual( query.downsample(), '60m-avg' );
	});


	// RATE //

	it( 'should provide a rate method', function test() {
		var query = createQuery();
		expect( query.rate ).to.be.a( 'function' );
	});

	it( 'should not allow a non-boolean rate', function test() {
		var query = createQuery(),
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
		var query = createQuery();
		query.rate( true );
		assert.strictEqual( query.rate(), true );
	});


	// RATE OPTIONS //

	it( 'should provide a rate options method', function test() {
		var query = createQuery();
		expect( query.rateOptions ).to.be.a( 'function' );
	});

	it( 'should not allow a non-object rate options argument', function test() {
		var query = createQuery(),
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
		var query = createQuery(),
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
		var query = createQuery();
		query.rateOptions( {'counter': true} );
		assert.strictEqual( query.rateOptions().counter, true );
	});

	it( 'should not allow a non-numeric rate options counter max', function test() {
		var query = createQuery(),
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
		var query = createQuery();
		query.rateOptions( {'counterMax': 5000} );
		assert.strictEqual( query.rateOptions().counterMax, 5000 );
	});

	it( 'should not allow a non-numeric rate options reset value', function test() {
		var query = createQuery(),
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
		var query = createQuery();
		query.rateOptions( {'resetValue': 5000} );
		assert.strictEqual( query.rateOptions().resetValue, 5000 );
	});


	// TAGS //

	it( 'should provide a tags method', function test() {
		var query = createQuery();
		expect( query.tags ).to.be.a( 'function' );
	});

	it( 'should not allow a non-string tag name', function test() {
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
				query.tags( value );
			};
		}
	});

	it( 'should not allow a non-string tag value', function test() {
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
				query.tags( 'tag', value );
			};
		}
	});

	it( 'should set a tag value', function test() {
		var query = createQuery(),
			tag = 'foo',
			value = 'bar';
		query.tags( tag, value );
		assert.strictEqual( query.tags( tag ), value );
	});

	it( 'should return all tags', function test() {
		var query = createQuery(),
			tags = {
				'tag1': 'value1',
				'tag2': 'value2'
			};

		query.tags( 'tag1', tags.tag1 );
		query.tags( 'tag2', tags.tag2 );
		assert.deepEqual( query.tags(), tags );
	});

	it( 'should return a tag value', function test() {
		var query = createQuery(),
			tag = 'beep',
			value = 'boop';
		query.tags( tag, value );
		assert.strictEqual( query.tags( tag ), value );
	});


	// DELETE TAG //

	it( 'should provide a delete tag method', function test() {
		var query = createQuery();
		expect( query.dtag ).to.be.a( 'function' );
	});

	it( 'should require a tag name as input', function test() {
		var query = createQuery();
		expect( query.dtag ).to.throw( Error );
	});

	it( 'should not allow a non-string tag name', function test() {
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
				query.dtag( value );
			};
		}
	});

	it( 'should delete a tag', function test() {
		var query = createQuery(),
			tag = 'tag',
			value = 'value';
		query.tags( tag, value );
		assert.strictEqual( query.tags( tag ), value );
		query.dtag( tag );
		assert.isUndefined( query.tags( tag ) );
	});

});