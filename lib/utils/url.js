/**
*
*	OPENTSDB: url
*
*
*	DESCRIPTION:
*		- Generates URLs tailored to a configured OpenTSDB client.
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

	// URL //

	/**
	* FUNCTION: URL( client )
	*	URL constructor.
	*
	* @constructor
	* @param {Client} client - OpenTSDB client instance
	* @returns {URL} URL instance
	*/
	function URL( client ) {
		this._client = client; // no validation/type-checking
		this._template = '';
		return this;
	} // end FUNCTION URL()

	/**
	* METHOD: template()
	*	URL template generator. Generates a template request URL based on an OpenTSDB client configuration. Template contains two template parameters: `start` and `end`.
	*
	* @returns {URL} URL instance
	*/
	URL.prototype.template = function() {
		var client = this._client,
			queries = client._queries,
			numQueries = queries.length,
			query,
			tmpl = '',
			aFLG, gFLG,
			fields = '',
			tags, numTags, tag;

		// NOTE: no type checking!

		// Base query URL:
		tmpl += 'http://' + client._host + ':' + client._port;
		tmpl += '/api/query?';

		// Millisecond resolution:
		tmpl += 'ms=' + client._ms.toString();
		tmpl += '&';

		// Arrays output:
		tmpl += 'arrays=' + client._arrays.toString();
		tmpl += '&';

		// TSUIDs output:
		tmpl += 'show_tsuids=' + client._tsuids;
		tmpl += '&';

		// Annotations:
		switch ( client._annotations ) {
			case 'none':
				// Turn off returning any annotations:
				aFLG = false;
				gFLG = false;
				break;
			case 'local':
				// Turn off returning global annotations:
				aFLG = true;
				gFLG = false;
				break;
			case 'all':
				// Turn on returning all annotations:
				aFLG = true;
				gFLG = true;
				break;
		}
		tmpl += 'no_annotations=' + (!aFLG).toString();
		tmpl += '&';

		tmpl += 'global_annotations=' + gFLG.toString();
		tmpl += '&';

		// Start time (template parameter):
		tmpl += 'start={{start}}';
		tmpl += '&';

		// End time (template parameter):
		tmpl += 'end={{end}}';
		tmpl += '&';

		// Queries:
		for ( var i = 0; i < numQueries; i++ ) {
			query = queries[ i ];

			if ( !query._tsuids && !query._metric ) {
				throw new Error( 'template()::invalid query. Query must either have a set metric name or list of TSUIDs.' );
			}

			fields = '';

			// Aggregator:
			fields += query._aggregator;
			fields += ':';

			// Rate?
			if ( query._rate ) {
				fields += 'rate{';

				// Counter:
				fields += query._rateOptions.counter;
				fields += ',';

				// Counter Max:
				if ( typeof query._rateOptions.counterMax === 'number' ) {
					fields += query._rateOptions.counterMax;
				}
				fields += ',';

				// Reset Value:
				fields += query._rateOptions.resetValue;
				fields += '}';
				fields += ':';
			}

			// Downsample:
			if ( query._downsample ) {
				fields += query._downsample ;
				fields += ':';
			}

			switch ( query.type ) {
				case 'tsuids':
					tmpl += 'tsuids=' + fields + query._tsuids;
					break;
				case 'metric':
					tmpl += 'm=' + fields + query._metric;
					tags = Object.keys( query._tags );
					numTags = tags.length;
					if ( numTags ) {
						tmpl += '{';
						for ( var j = 0; j < tags.length; j++ ) {
							tag = tags[ j ];
							tmpl += tag + '=' + query._tags[ tag ];
							if ( j < numTags-1 ) {
								tmpl += ',';
							}
						}
						tmpl += '}';
					}
					break;
			} // end SWITCH type

			if ( i < numQueries-1 ) {
				tmpl += '&';
			}
		} // end FOR i

		this._template = tmpl;

		return this;
	}; // end METHOD template()

	/**
	* METHOD: create()
	*	Insert start and end times into a template OpenTSDB query string.
	*
	* @returns {String} URL query string
	*/
	URL.prototype.create = function() {
		var url = this._template,
			start = this._client._start,
			end = this._client._end;

		// Set the start time:
		url = url.replace( /\{\{start\}\}/, start );

		// Set the end time:
		if ( typeof end === 'number' && end === end ) {
			url = url.replace( /\{\{end\}\}/, end );
		} else {
			url = url.replace( /end=\{\{end\}\}&/, '' );
		}

		return url;
	}; // end METHOD create()


	// EXPORTS //

	module.exports = function getURL( client ) {
		if ( !arguments.length ) {
			throw new Error( 'url()::insufficient input arguments. Must provide a OpenTSDB client instance.' );
		}
		return new URL( client );
	};

})();