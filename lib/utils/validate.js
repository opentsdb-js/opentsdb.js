/**
*
*	OPENTSDB: validate time
*
*
*	DESCRIPTION:
*		- Validates time query parameters.
*
*
*	NOTES:
*		[1] For OpenTSDB time formatting, see http://opentsdb.net/docs/build/html/user_guide/query/dates.html
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/07/18: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// VARIABLES //

	var PATTERNS = {};

	// Absolute time formatting; e.g., 2014/07/18-9:34:42:
	PATTERNS.absolute = /^\d{4}\/\d{1,2}\/\d{1,2}$|^\d{4}\/\d{1,2}\/\d{1,2}\s|\-\d{1,2}:\d{2}$|^\d{4}\/\d{1,2}\/\d{1,2}\s|\-\d{1,2}:\d{2}:\d{2}$/;

	// Relative time formatting; e.g., 72000ms-ago:
	PATTERNS.relative = /^\d+ms|[smhdwmny]\-ago/;

	// Seconds or milliseconds; e.g., Date.now():
	PATTERNS.timestamp = /^\d{10}$|^\d{13}$/;


	// VALIDATE //

	/**
	* FUNCTION: Validate()
	*	Validation constructor.
	*
	* @constructor
	* @returns {Validate} Validate instance
	*/
	function Validate() {
		return this;
	} // end FUNCTION Validate()

	/**
	* METHOD: relative( time )
	*	Validates whether a time is a relative time.
	*
	* @example Example relative time.
	*	// returns true
	* validate.relative( '72000ms-ago' );
	*
	* @param {String} time - time to validate
	* @returns {Boolean} boolean indicating whether a time is formatted as relative time.
	*/
	Validate.prototype.relative = function( time ) {
		if ( typeof time !== 'string' ) {
			throw new Error( 'relative()::invalid input argument. Time must be a string.' );
		}
		return PATTERNS[ 'relative' ].test( time );
	}; // end METHOD relative()

	/**
	* METHOD: absolute( time )
	*	Validates whether a time is an absolute time.
	*
	* @example Example absolute time.
	*	// returns true
	* validate.absolute( '2014/07/14-9:23:23' );
	*
	* @example Example absolute time.
	*	// returns true
	* validate.absolute( '2014/07/14 9:23' );
	*
	* @example Example absolute time.
	*	// returns true
	* validate.absolute( '2014/07/14' );
	*
	* @param {String} time - time to validate
	* @returns {Boolean} boolean indicating whether a time is formatted as absolute time.
	*/
	Validate.prototype.absolute = function( time ) {
		if ( typeof time !== 'string' ) {
			throw new Error( 'absolute()::invalid input argument. Time must be a string.' );
		}
		return PATTERNS[ 'absolute' ].test( time );
	}; // end METHOD absolute()

	/**
	* METHOD: timestamp( time )
	*	Validates whether a time is a Unix timestamp.
	*
	* @example Example Unix timestamp.
	*	// returns true
	* validate.timestamp( Date.now() );
	*
	* @param {Number} time - time to validate
	* @returns {Boolean} boolean indicating whether a time is formatted as Unix time.
	*/
	Validate.prototype.timestamp = function( time ) {
		if ( typeof time !== 'number' || time !== time ) {
			throw new Error( 'timestamp()::invalid input argument. Time must be numeric.' );
		}
		return PATTERNS[ 'timestamp' ].test( time.toString() );
	}; // end METHOD timestamp()

	/**
	* METHOD: format( time )
	*	Returns the format of the input time. If the time is of an unknown format, returns undefined.
	*
	* @param {String|Number} time - time to be validated
	* @returns {String|undefined} time format
	*/
	Validate.prototype.format = function( time ) {
		var type = typeof time;
		if ( type !== 'string' && ( type !== 'number' || time !== time ) ) {
			throw new Error( 'format()::invalid input argument. Time must be either a string or numeric.' );
		}
		if ( type === 'string' ) {
			if ( this.absolute( time ) ) {
				return 'absolute';
			} else if ( this.relative( time ) ) {
				return 'relative';
			}
		}
		if ( type === 'number' ) {
			if ( this.timestamp( time ) ) {
				return 'timestamp';
			}
		}
		return;
	}; // end METHOD format()


	// EXPORTS //

	module.exports = new Validate();

})();