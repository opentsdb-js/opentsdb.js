OpenTSDB
========
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

JavaScript [OpenTSDB](http://opentsdb.net) library.



### Install

For use in Node.js,

``` bash
$ npm install opentsdb
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).



### Client

To interface with OpenTSDB, one must first create a client. To do so,

``` javascript
var opentsdb = require( 'opentsdb' );

var client = opentsdb.client();
```

OpenTSDB clients are configurable and have the following methods...


#### client.host( [host] )

This method is a setter/getter. If no `host` is provided, the method returns the configured `host`. By default, the client `host` is `127.0.0.1`. To point to a remote `host`,

``` javascript
client.host( '192.168.92.11' );
```

#### client.port( [port] )

This method is a setter/getter. If no `port` is provided, the method returns the configured `port`. By default, the client port is `4242`. To set a different `port`,

``` javascript
client.port( 8080 );
```

#### client.ms( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether time should be output at millisecond resolution. By default, millisecond resolution is on, so as to ensure timestamps are 13 digit UNIX timestamps. To turn off millisecond resolution,

``` javascript
client.ms( false );
```

#### client.arrays( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether data is output as an array. By default, array output is on. To turn off array output,

``` javascript
client.arrays( false );
```

#### client.tsuids( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether TSUIDs accompany data output. By default, TSUIDs are not returned. To turn on TSUID output,

``` javascript
client.tsuids( true );
```

#### client.annotations( [option] )

This method is a setter/getter. If no option is provided, the method returns the option indicating whether annotations should accompany data output. OpenTSDB supports two types of annotations: local and global. By default, annotations are not returned. 

Three options are possible: `none`, `local`, and `all`. `none` indicates to return no annotations. `local` indicates to return only local annotations; i.e., annotations specific to a timeseries. `all` indicates to return both local and global annotations. OpenTSDB does not support returning only global annotations.

To set annotation output,

``` javascript
client.annotations( 'all' );
```


#### client.start( [time] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query start `time`. Before making an OpenTSDB query, a start time is __required__. To do so,

``` javascript
client.start( Date.now()-1000 );
```

#### client.end( [time | null] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query end `time`. An end time is optional when making an OpenTSDB query. If no end time is set upon making a query, OpenTSDB defaults to the time at which the request is made.

``` javascript
client.end( Date.now() );
```

If at time `t1` you specify an end time and later decide at `t2` to make a request which does not specify an end time, you can `null` the configuration value.

``` javascript
client.end( null );
```

#### client.queries( [query1, query2, query3,...] )

This method is a setter/getter. If no queries are provided, the method returns any previously set queries. Queries must be set before making an OpenTSDB data request. To create queries, see below.

``` javascript
client.queries( mQuery, mQuery, tQuery );
```

#### client.url()

Generate an OpenTSDB request URL based on a client's configuration. Both queries and a start time are __required__ before running this method.

``` javascript
var url = client.url();
```

An example returned `url`:

```
http://127.0.0.1:4242/api/query?ms=true&arrays=true&show_tsuids=true&no_annotations=true&global_annotations=false&start=72000ms-ago&end=60s-ago&m=avg:5s-avg:cpu.utilization{nid=*}&m=avg:5s-avg:mem.utilization{nid=*}
```

#### client.get( clbk )

Make a data request from OpenTSDB. Results are passed along to the provided callback.

``` javascript
client.get( function onData( error, data ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( data ) );
});
```

#### client.aggregators( clbk )

Requests the current list of supported aggregation operators from OpenTSDB. Results are passed along to the provided callback.

``` javascript
client.aggregators( function onResponse( error, aggregators ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( aggregators ) );
});
```

#### client.metrics( clbk )

Requests the current list of stored metrics from OpenTSDB. Results are passed along to the provided callback.

``` javascript
client.metrics( function onResponse( error, metrics ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( metrics ) );
});
```

#### client.config( clbk )

Requests the current OpenTSDB [configuration](http://opentsdb.net/docs/build/html/api_http/config.html). Results are passed along to the provided callback.

``` javascript
client.config( function onResponse( error, config ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( config ) );
});
```

#### client.version( clbk )

Requests the current OpenTSDB [version](http://opentsdb.net/docs/build/html/api_http/version.html). Results are passed along to the provided callback.

``` javascript
client.version( function onResponse( error, version ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( version ) );
});
```

#### client.dropcaches( clbk )

Instructs an OpenTSDB to purge its in-memory [caches](http://opentsdb.net/docs/build/html/api_http/dropcaches.html). The response is passed along to the provided callback.

``` javascript
client.dropcaches( function onResponse( error, body ) {
	if ( error ) {
		console.error( JSON.stringify( error ) );
		return;
	}
	console.log( JSON.stringify( body ) );
});
```


### Queries

OpenTSDB permits two query [types](/docs/build/html/api_http/query/index.html): _metric_ and _tsuid_.

Metric queries are general queries which return an indeterministic number of timeseries. OpenTSDB implements metric queries by searching for timeseries matching the metric criteria, e.g., `metric name` and `tag`.

TSUID queries request a specific timeseries having a unique id. Every timeseries has an assigned [unique identifier](http://opentsdb.net/docs/build/html/user_guide/backends/hbase.html#uid-table-schema), which is based on `metric name` and any `tags`.

The `opentsdb` module supports both query types. To create queries,

``` javascript
var opentsdb = require( 'opentsdb' );

// Metric query generator:
var mQuery = opentsdb.mquery();

// TSUID query generator:
var tQuery = opentsdb.tquery();
```

The distinctions between the two types are 1) metric queries require a metric name and tsuid queries require a string list of tsuids and 2) tsuid queries do not accept tags. Otherwise, both types have the same methods, as outlined below.

#### query.aggregator( [aggregator] )

This method is a setter/getter. If no `aggregator` is provided, returns the query [aggregator](http://opentsdb.net/docs/build/html/api_http/aggregators.html) . The default aggregator is `avg`. To set a different `aggregator`,

``` javascript
query.aggregator( 'min' );
```

#### query.downsample( [downsample] )

This method is a setter/getter. If no `downsample` function is provided, returns the configured `downsample` function. By default, downsampling is turned off. To specify a `downsample` function,

``` javascript
query.downsample( '5s-avg' );
```


#### query.rate( [bool] )

This method is a setter/getter. If no boolean flag is provided, returns the flag indicating whether to return the difference between consecutive data values. By default, the flag is `false`. To turn on difference calculation,

``` javascript
query.rate( true );
```

Note that rate calculation requires a set of three options.


#### query.rateOptions( [object] )

This method is a setter/getter. If no configuration object is provided, returns the rate options: `counter`, `counterMax`, `resetValue`. `counter` must be a boolean; `counterMax` must be numeric or `null`; and `resetValue` must be numeric.

By default,

``` javascript
var rateOptions = {
	"counter": false,
	"counterMax": null,
	"resetValue": 0
};
```


#### mQuery.tags( [tag, [value]] )

This method is a setter/getter. If no arguments are provided, returns all tag names and their values. If a `tag` name is specified, returns the value for that tag. Otherwise, sets a `tag` to the specified `value`.

``` javascript
mQuery.tags( 'nid', '*' );
```

The `*` (wildcard) indicates all values for a `tag`.


#### mQuery.dtag( tag )

This method deletes a query `tag`.

``` javascript
// Add a tag:
mQuery.tags( 'nid', '*' );

// Delete the tag:
mQuery.dtag( 'nid' );
```


#### mQuery.metric( [name] )

This method is a setter/getter. If no `metric name` is provided, returns the query `metric name`. A `metric name` is __required__ to encode a metric query. To set a `metric name`,

``` javascript
mQuery.metric( 'mem.utilization' );
```


#### tQuery.tsuids( [tsuids] )

This method is a setter/getter. If no `tsuids` are provided, return the query `tsuids`. `tsuids` are __required__ to encode a tsuid query. To set `tsuids`,

``` javascript
tQuery.tsuids( '001,002,003' );
```


### Data Model

OpenTSDB specifies a data [model](http://opentsdb.net/docs/build/html/user_guide/writing.html#data-specification) for every timeseries datapoint. To create an OpenTSDB datum,

``` javascript
var opentsdb = require( 'opentsdb' );

var datum = opentsdb.datum();
```

A datum is configurable and has the following methods...


#### datum.metric( [name] )

This method is a setter/getter. If no `metric name` is provided, returns the `metric name` assigned to a datum. A `metric name` is __required__ to properly describe a datum. To set a `metric name`,

``` javascript
datum.metric( 'cpu.utilization' );
```

#### datum.timestamp( [timestamp] )

This method is a setter/getter. If no `timestamp` is provided, returns the `timestamp` assigned to a datum. A `timestamp` is __required__ to properly describe a datum. To set a `timestamp`,

``` javascript
datum.timestamp( Date.now() );
```

A `timestamp` may either be a date string or a UNIX timestamp.


#### datum.value( [value] )

This method is a setter/getter. If no `value` is provided, returns the datum `value`. A `value` is __required__ to properly describe a datum. To set a datum `value`,

``` javascript
datum.value( Math.random() );
```


#### datum.tags( [tag, [value]] )

This method is a setter/getter. If no arguments are provided, returns all tag names and their values. If a `tag` name is specified, returns the value for that tag. Otherwise, sets a `tag` to the specified `value`.

``` javascript
datum.tags( 'beep', 'boop' );
```

A `tag` is an additional piece of information which describes a `datum`. For example, a `cpu.user` timeseries `datum` may originate from a particular host; e.g., `host=webserver1`. To later be able to query OpenTSDB for only those `cpu.user` timeseries originating from `webserver1` while optimizing for aggregations across multiple web servers, OpenTSDB allows data tagging. In this case,

``` javascript
datum.tags( 'host', 'webserver1' );
```

The decision to tag a `datum` or include additional information in the `metric name` depends on your [naming schema](http://opentsdb.net/docs/build/html/user_guide/writing.html#naming-schema). Be careful to consider your query needs before deciding one way or the other.


#### datum.dtag( tag )

This method deletes a datum `tag`.

``` javascript
// Add a tag:
datum.tags( 'beep', 'boop' );

// Delete the tag:
datum.dtag( 'beep' );
```


#### datum.toString()

This method serializes the datum. The datum must have a `metric name`, `timestamp`, and `value` to be serializable. To serialize a datum,

``` javascript
datum.toString();
```

Because a `datum` is configurable, a `datum` serves as a factory for serializing similar data.

``` javascript
var data = new Array( 100 );

// Configure a datum:
datum
	.metric( 'cpu.utilization' )
	.tags( 'beep', 'boop' )
	.tags( 'foo', 'bar' );

for ( var i = 0; i < data.length; i++ ) {
	// Assign values to the datum:
	datum
		.timestamp( Date.now() )
		.value( Math.random() );

	// Serialize and store:
	data[ i ] = datum.toString();
}

// Convert to a newline delimited string:
data = data.join( '\n' );

console.log( data );
```





---
## Notes

When used as setters, all setter/getter methods are chainable. For example,

``` javascript
var opentsdb = require( 'opentsdb' ),
	client = opentsdb.client(),
	mQuery = opentsdb.mquery();

mQuery
	.aggregator( 'sum' )
	.downsample( '5m-avg' )
	.rate( false )
	.metric( 'mem.utilization' )
	.tags( 'nid', '1234,5678' )
	.tags( 'name', 'beep,boop' );

client
	.host( '192.168.92.111' )
	.port( 8080 )
	.ms( true )
	.arrays( true )
	.tsuids( true )
	.annotations( 'all' )
	.start( Date.now()-1000 ) 
	.end( Date.now() )
	.queries( mQuery )
	.get( function onData( error, data ) {
		if ( error ) {
			console.error( JSON.stringify( error ) );
			return;
		}
		console.log( JSON.stringify( data ) );
	});
```


---
## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/opentsdb.svg
[npm-url]: https://npmjs.org/package/opentsdb

[travis-image]: http://img.shields.io/travis/opentsdb-js/opentsdb.js/master.svg
[travis-url]: https://travis-ci.org/opentsdb-js/opentsdb.js

[coveralls-image]: https://img.shields.io/coveralls/opentsdb-js/opentsdb.js/master.svg
[coveralls-url]: https://coveralls.io/r/opentsdb-js/opentsdb.js?branch=master

[dependencies-image]: http://img.shields.io/david/opentsdb-js/opentsdb.js.svg
[dependencies-url]: https://david-dm.org/opentsdb-js/opentsdb.js

[dev-dependencies-image]: http://img.shields.io/david/dev/opentsdb-js/opentsdb.js.svg
[dev-dependencies-url]: https://david-dm.org/dev/opentsdb-js/opentsdb.js

[github-issues-image]: http://img.shields.io/github/issues/opentsdb-js/opentsdb.js.svg
[github-issues-url]: https://github.com/opentsdb-js/opentsdb.js/issues