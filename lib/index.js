/**
*
*	OPENTSDB: lib
*
*
*	DESCRIPTION:
*		- OpenTSDB library.
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

	// OpenTSDB //

	var opentsdb = {};


	/**
	* Client.
	*/
	opentsdb.client = require( './client' );

	/**
	* Socket.
	*/
	opentsdb.socket = require( 'opentsdb-socket' );

	/**
	* Datum.
	*/
	opentsdb.datum = require( 'opentsdb-datum' );

	/**
	* Queries.
	*/
	opentsdb.mquery = require( './query/metric.js' );
	opentsdb.tquery = require( './query/tsuids.js' );


	// EXPORTS //

	module.exports = opentsdb;

})();