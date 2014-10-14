/**
*
*	OPENTSDB: GET/ response
*
*
*	DESCRIPTION:
*		- Response callback for GET request.
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
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com.
*
*/

(function() {
	'use strict';

	/**
	* FUNCTION: getResponse( clbk )
	*	Returns a response handler.
	*
	* @param {Function} clbk - callback to invoke upon receiving a request response. Function should accept two arguments: [ error, data ].
	* @returns {Function} response handler
	*/
	function getResponse( clbk ) {
		if ( typeof clbk !== 'function' ) {
			throw new Error( 'getResponse()::invalid input argument. Callback must be a function.' );
		}
		/**
		* FUNCTION: onResponse( error, response, body )
		*	Response handler.
		*
		* @private
		* @param {Object} error - error object
		* @param {Object} response - response object
		* @param {String} body - response body
		*/
		return function onResponse( error, response, body ) {
			var data;
			if ( error ) {
				clbk({
					'status': 502,
					'message': 'Request error. Unable to obtain data.'
				});
				return;
			}
			if ( !body ) {
				clbk({
					'status': 404,
					'message': 'No data returned. Empty body. Ensure all query parameters are correct.'
				});
				return;
			}
			try {
				data = JSON.parse( body );
			} catch ( err ) {
				clbk({
					'status': 502,
					'message': 'Unsupported data format. Response body cannot be parsed as JSON.'
				});
				return;
			}
			if ( Array.isArray( data ) && !data.length ) {
				clbk({
					'status': 404,
					'message': 'No data returned. Empty data array. Ensure all query parameters are correct.'
				});
				return;
			}
			clbk( null, data );
		}; // end FUNCTION onResponse()
	} // end FUNCTION getResponse()


	// EXPORTS //

	module.exports = getResponse;

})();