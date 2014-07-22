
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	getHandler = require( './../lib/request/get_response.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'lib/request/get_response', function tests() {

	// TESTS //

	it( 'should export a function', function test() {
		expect( getHandler ).to.be.a( 'function' );
	});

	it( 'should throw an error if its first argument is not a function', function test() {

		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( true ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );
		expect( badValue( '5' ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				getHandler( value, function(){} );
			};
		}
	});

	it( 'should be a function factory', function test() {
		expect( getHandler( function(){} ) ).to.be.a( 'function' );
	});

	// NOTE: additional functional tests are done through testing the get request module.

});