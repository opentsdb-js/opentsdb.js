/**
*
*	OPENTSDB: lib
*
*
*	DESCRIPTION:
*		- OpenTSDB client library.
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

	// OpenTSDB //

	var opentsdb = {};


	/**
	* Client.
	*/
	opentsdb.client = require( './client' );

	/**
	* Datum.
	*/
	opentsdb.datum = require( './datum' );

	/**
	* Queries.
	*/
	opentsdb.mquery = require( './query/metric.js' );
	opentsdb.tquery = require( './query/tsuids.js' );


	// EXPORTS //

	module.exports = opentsdb;

})();