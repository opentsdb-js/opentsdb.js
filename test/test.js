
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	lib = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// FUNCTIONS //

/**
* FUNCTION: test_property( name )
*	Tests that the OpenTSDB client library has a property and that the property is a function.
*
* @param {String} name - property name
*/
function test_property( name ) {
	it( 'should have a `' + name + '` property that is a function', function test() {
		expect( lib ).to.have.property( name ).that.is.a( 'function' );
	});
} // end FUNCTION test_property()


// TESTS //

describe( '/lib', function tests() {
	'use strict';

	var properties = [
			'client',
			'socket',
			'mquery',
			'tquery',
			'datum'
		];

	it( 'should export an object', function test() {
		expect( lib ).to.be.an( 'object' );
	});

	it( 'should only have the properties specified in the tests', function test() {
		assert.strictEqual( Object.keys( lib ).length, properties.length );
	});

	// Run the property tests...
	for ( var i = 0; i < properties.length; i++ ) {
		test_property( properties[ i ] );
	}

});