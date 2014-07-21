/**
*
*	OPENTSDB: GET/
*
*
*	DESCRIPTION:
*		- Performs a GET request from OpenTSDB.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/07/21: Created. [AReines].
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

	// MODULES //

	var // Request module:
		request = require( 'request' );


	// QUERY //

	/**
	* FUNCTION: query( url, clbk )
	*	Returns a function to query an OpenTSDB endpoint. Wraps the provided url and clbk in a closure.
	*
	* @param {String} url - OpenTSDB url endpoint
	* @param {Function} clbk - callback to invoke upon receiving a response. Function should accept two arguments: [ error, data ]. If no errors, `error` is null. If error, `error` is an object with status and message fields.
	* @returns {Function} function to query a OpenTSDB
	*/
	function query( url, clbk ) {
		if ( typeof url !== 'string' ) {
			throw new Error( 'query()::invalid input argument. URL must be a string.' );
		}
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'query()::invalid input argument. Callback must be a function.' );
		}
		/**
		* FUNCTION: getData()
		*	Function to query an OpenTSDB endpoint.
		*
		* @private
		*/
		return function getData() {
			request({
				'method': 'GET',
				'uri': url
			}, function onResponse( error, response, body ) {
				var data;
				if ( error ) {
					clbk({
						'status': 502,
						'message': 'Request error. Unable to obtain data. Query: ' + url
					});
					return;
				}
				if ( !body ) {
					clbk({
						'status': 404,
						'message': 'Empty body. No data returned. Ensure all query parameters are correct. Query: ' + url
					});
					return;
				}
				try {
					data = JSON.parse( body );
				} catch ( err ) {
					clbk({
						'status': 502,
						'message': 'Unable to parse data. Query: ' + url
					});
					return;
				}
				if ( !data.length ) {
					clbk({
						'status': 404,
						'message': 'Empty data array. No data returned. Ensure all query parameters are correct. Query: ' + url
					});
					return;
				}
				clbk( null, data );
			});
		}; // end FUNCTION getData()
	} // end FUNCTION query()


	// EXPORTS //

	module.exports = query;

})();