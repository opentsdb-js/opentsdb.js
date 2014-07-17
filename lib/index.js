/**
*
*	OPENTSDB: lib
*
*
*	DESCRIPTION:
*		- Node.js OpenTSDB library.
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
*		- 2014/07/16: Created. [AReines].
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

	// TSDB //

	var tsdb = {};


	/**
	* Client.
	*/
	tsdb.client = require( './client' );

	/**
	* Queries.
	*/
	tsdb.mquery = require( './query.metric.js' );
	tsdb.tquery = require( './query.tsuids.js' );


	// EXPORTS //

	module.exports = tsdb;

})();