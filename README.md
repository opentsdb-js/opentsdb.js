OpenTSDB
========
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> JavaScript library for [OpenTSDB](http://opentsdb.net).


## Table of Contents

1. 	[Installation](#installation)
1. 	[Usage](#usage)
	- 	[Client](#client)
		* 	[client.host()](#client-host)
		*	[client.port()](#client-port)
		*	[client.ms()](#client-ms)
		*	[client.arrays()](#client-arrays)
		*	[client.tsuids()](#client-tsuids)
		* 	[client.annotations()](#client-annotations)
		* 	[client.start()](#client-start)
		*	[client.end()](#client-end)
		*	[client.queries()](#client-queries)
		*	[client.url()](#client-url)
		*	[client.get()](#client-get)
		*	[client.aggregators()](#client-aggregators)
		*	[client.metrics()](#client-metrics)
		*	[client.config()](#client-config)
		*	[client.version()](#client-version)
		*	[client.dropcaches()](#client-dropcaches)
	- 	[Queries](#queries)
		* 	[query.aggregator()](#query-aggregator)
		*	[query.downsample()](#query-downsample)
		*	[query.rate()](#query-rate)
		*	[query.rateOptions()](#query-rateoptions)
		*	[mQuery.tags()](#mquery-tags)
		*	[mQuery.dtag()](#mquery-dtag)
		*	[mQuery.metric()](#mquery-metric)
		*	[tQuery.tsuids()](#tquery-tsuids)
	- 	[Data Model](#data-model)
		*	[datum.metric()](#datum-metric)
		*	[datum.timestamp()](#datum-timestamp)
		*	[datum.value()](#datum-value)
		*	[datum.tags()](#datum-tags)
		*	[datum.dtag()](#datum-dtag)
		*	[datum.toString()](#datum-tostring)
	- 	[Socket](#socket)
		* 	[socket.host()](#socket-host)
		*	[socket.port()](#socket-port)
		*	[socket.connect()](#socket-connect)
		*	[socket.status()](#socket-status)
		*	[socket.strict()](#socket-strict)
		*	[socket.write()](#socket-write)
		*	[socket.end()](#socket-end)
		*	[Events](#events)
			- 	[connect](#socket-events-connect)
			-	[error](#socket-events-error)
			-	[close](#socket-events-close)
			-	[warn](#socket-events-warn)
1. 	[Notes](#notes)
1. 	[Tests](#tests)
	- 	[Unit](#unit)
	- 	[Coverage](#test-coverage)
1. 	[License](#license)


---
## Installation

For use in Node.js,

``` bash
$ npm install opentsdb
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

This library is comprised of the following core components...


### [Client](https://github.com/opentsdb-js/client)

To interface with OpenTSDB, one must first create a client. To do so,

``` javascript
var opentsdb = require( 'opentsdb' );

var client = opentsdb.client();
```

OpenTSDB clients are configurable and have the following methods...


<a name="client-host"></a>
#### client.host( [host] )

This method is a setter/getter. If no `host` is provided, the method returns the configured `host`. By default, the client `host` is `127.0.0.1`. To point to a remote `host`,

``` javascript
client.host( '192.168.92.11' );
```


<a name="client-port"></a>
#### client.port( [port] )

This method is a setter/getter. If no `port` is provided, the method returns the configured `port`. By default, the client port is `4242`. To set a different `port`,

``` javascript
client.port( 8080 );
```


<a name="client-ms"></a>
#### client.ms( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether time should be output at millisecond resolution. By default, millisecond resolution is on, so as to ensure timestamps are 13 digit UNIX timestamps. To turn off millisecond resolution,

``` javascript
client.ms( false );
```


<a name="client-arrays"></a>
#### client.arrays( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether data is output as an `array`. By default, `array` output is on. To turn off `array` output,

``` javascript
client.arrays( false );
```


<a name="client-tsuids"></a>
#### client.tsuids( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether TSUIDs accompany data output. By default, TSUIDs are not returned. To turn on TSUID output,

``` javascript
client.tsuids( true );
```


<a name="client-annotations"></a>
#### client.annotations( [option] )

This method is a setter/getter. If no option is provided, the method returns the option indicating whether annotations should accompany data output. OpenTSDB supports two types of annotations: local and global. By default, annotations are not returned. 

Three options are possible: `none`, `local`, and `all`. `none` indicates to return no annotations. `local` indicates to return only local annotations; i.e., annotations specific to a timeseries. `all` indicates to return both local and global annotations. OpenTSDB does not support returning only global annotations.

To set annotation output,

``` javascript
client.annotations( 'all' );
```


<a name="client-start"></a>
#### client.start( [time] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query start `time`. Before making an OpenTSDB query, a start time is __required__. To do so,

``` javascript
// UNIX timestamp:
client.start( Date.now()-1000 );

// Absolute time:
client.start( '2014/10/18 09:45' );

// Relative time:
client.start( '72m-ago' );
```


<a name="client-end"></a>
#### client.end( [time | null] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query end `time`. An end time is optional when making an OpenTSDB query. If no end time is set upon making a query, OpenTSDB defaults to the time at which the request is made.

``` javascript
// UNIX timestamp:
client.end( Date.now() );

// Absolute time:
client.end( '2014/10/18 09:47' );

// Relative time:
client.end( '70m-ago' );
```

If at time `t1` you specify an end time and later decide at `t2` to make a request which does not specify an end time, you can `null` the configuration value.

``` javascript
client.end( null );
```


<a name="client-queries"></a>
#### client.queries( [query1, query2, query3,...] )

This method is a setter/getter. If no queries are provided, the method returns any previously set queries. Queries must be set before making an OpenTSDB data request. To create queries, see below.

``` javascript
client.queries( mQuery, mQuery, tQuery );
```


<a name="client-url"></a>
#### client.url()

Generate an OpenTSDB request URL based on a client's configuration. Both queries and a start time are __required__ before running this method.

``` javascript
var url = client.url();
```

An example returned `url`:

```
http://127.0.0.1:4242/api/query?ms=true&arrays=true&show_tsuids=true&no_annotations=true&global_annotations=false&start=72000ms-ago&end=60s-ago&m=avg:5s-avg:cpu.utilization{nid=*}&m=avg:5s-avg:mem.utilization{nid=*}
```


<a name="client-get"></a>
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


<a name="client-aggregators"></a>
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


<a name="client-metrics"></a>
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


<a name="client-config"></a>
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


<a name="client-version"></a>
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


<a name="client-dropcaches"></a>
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

OpenTSDB permits two query [types](/docs/build/html/api_http/query/index.html): _[metric](https://github.com/opentsdb-js/mquery)_ and _[tsuid](https://github.com/opentsdb-js/tquery)_.

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


<a name="query-aggregator"></a>
#### query.aggregator( [aggregator] )

This method is a setter/getter. If no `aggregator` is provided, returns the query [aggregator](http://opentsdb.net/docs/build/html/api_http/aggregators.html). The default aggregator is `avg`. To set a different `aggregator`,

``` javascript
query.aggregator( 'min' );
```


<a name="query-downsample"></a>
#### query.downsample( [downsample] )

This method is a setter/getter. If no `downsample` function is provided, returns the configured `downsample` function. By default, downsampling is turned off (i.e., set to `null`). To specify a `downsample` function,

``` javascript
query.downsample( '5s-avg' );
```


<a name="query-rate"></a>
#### query.rate( [bool] )

This method is a setter/getter. If no boolean flag is provided, returns the flag indicating whether to return the difference between consecutive data values. By default, the flag is `false`. To turn on difference calculation,

``` javascript
query.rate( true );
```

Note that rate calculation requires a set of three options.



<a name="query-rateoptions"></a>
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


<a name="mquery-tags"></a>
#### mQuery.tags( [tag, [value]] )

This method is a setter/getter. If no arguments are provided, returns all tag names and their values. If a `tag` name is specified, returns the value for that tag. Otherwise, sets a `tag` to the specified `value`.

``` javascript
mQuery.tags( 'nid', '*' );
```

The `*` (wildcard) indicates all values for a `tag`.



<a name="mquery-dtag"></a>
#### mQuery.dtag( tag )

This method deletes a query `tag`.

``` javascript
// Add a tag:
mQuery.tags( 'nid', '*' );

// Delete the tag:
mQuery.dtag( 'nid' );
```


<a name="mquery-metric"></a>
#### mQuery.metric( [name] )

This method is a setter/getter. If no `metric name` is provided, returns the query `metric name`. A `metric name` is __required__ to encode a metric query. To set a `metric name`,

``` javascript
mQuery.metric( 'mem.utilization' );
```


<a name="tquery-tsuids"></a>
#### tQuery.tsuids( [tsuids] )

This method is a setter/getter. If no `tsuids` are provided, return the query `tsuids`. `tsuids` are __required__ to encode a tsuid query. To set `tsuids`,

``` javascript
// Comma-delimited string:
tQuery.tsuids( '001,002,003' );

// Array:
tQuery.tsuids( ['001','002','003'] );
```


### [Data Model](https://github.com/opentsdb-js/datum)

OpenTSDB specifies a data [model](http://opentsdb.net/docs/build/html/user_guide/writing.html#data-specification) for every timeseries datapoint. To create an OpenTSDB datum,

``` javascript
var opentsdb = require( 'opentsdb' );

var datum = opentsdb.datum();
```

A datum is configurable and has the following methods...


<a name="datum-metric"></a>
#### datum.metric( [name] )

This method is a setter/getter. If no `metric name` is provided, returns the `metric name` assigned to a datum. A `metric name` is __required__ to properly describe a datum. To set a `metric name`,

``` javascript
datum.metric( 'cpu.utilization' );
```


<a name="datum-timestamp"></a>
#### datum.timestamp( [timestamp] )

This method is a setter/getter. If no `timestamp` is provided, returns the `timestamp` assigned to a datum. A `timestamp` is __required__ to properly describe a datum. To set a `timestamp`,

``` javascript
datum.timestamp( Date.now() );
```

A `timestamp` may either be a date string or a UNIX timestamp.


<a name="datum-value"></a>
#### datum.value( [value] )

This method is a setter/getter. If no `value` is provided, returns the datum `value`. A `value` is __required__ to properly describe a datum. To set a datum `value`,

``` javascript
datum.value( Math.random() );
```


<a name="datum-tags"></a>
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


<a name="datum-dtag"></a>
#### datum.dtag( tag )

This method deletes a datum `tag`.

``` javascript
// Add a tag:
datum.tags( 'beep', 'boop' );

// Delete the tag:
datum.dtag( 'beep' );
```


<a name="datum-tostring"></a>
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


### [Socket](https://github.com/opentsdb-js/socket)

To interface with OpenTSDB, one can create a socket client. To do so,

``` javascript
var createSocket = require( 'opentsdb-socket' );

var socket = createSocket();
```

OpenTSDB socket clients are configurable and have the following methods...


<a name="socket-host"></a>
#### socket.host( [host] )

This method is a setter/getter. If no `host` is provided, the method returns the configured `host`. By default, the client `host` is `127.0.0.1`. To point to a remote `host`,

``` javascript
socket.host( '192.168.92.11' );
```


<a name="socket-port"></a>
#### socket.port( [port] )

This method is a setter/getter. If no `port` is provided, the method returns the configured `port`. By default, the client port is `4242`. To set a different `port`,

``` javascript
socket.port( 8080 );
```


<a name="socket-connect"></a>
#### socket.connect()

Creates a TCP socket connection.

``` javascript
socket.connect();
```


<a name="socket-status"></a>
#### socket.status()

Returns the current connection status. If a socket connection exists, returns `true`. If no socket connection exists, returns `false`. 

``` javascript
socket.status();
```


<a name="socket-strict"></a>
#### socket.strict( [bool] )

This method is a setter/getter. If no boolean `flag` is provided, the method returns the strict setting. By default, the socket enforces strict type checking on socket writes. To turn off strict mode,

``` javascript
socket.strict( false );
```

Turn off strict mode when you are certain that arguments provided to the `socket.write()` method are of the proper type.


<a name="socket-write"></a>
#### socket.write( string[, clbk] )

Writes to the socket connection. If strict mode is `off`, no type checking of input arguments occurs. An optional callback is invoked after writing all data to the socket. To write to the socket,

``` javascript
var value = '';

value += 'put ';
value += 'cpu.utilization ';
value += Date.now() + ' ';
value += Math.random() + ' ';
value += 'beep=boop ';
value += 'foo=bar\n';

socket.write( value, function ack() {
	console.log( '...data written...' );
});
```

<a name="socket-end"></a>
#### socket.end()

Closes a socket connection. To close a socket,

``` javascript
socket.end();
```


### Events

The socket is an event-emitter and emits the following events...


<a name="socket-events-connect"></a>
#### 'connect'

The socket emits a `connect` event upon successfully establishing a socket connection. To register a listener,

``` javascript
socket.addListener( 'connect', function onConnect() {
	console.log( '...connected...' );
});
```

<a name="socket-events-error"></a>
#### 'error'

The socket emits an `error` event upon encountering an error. To register a listener,

``` javascript
socket.addListener( 'error', function onError( error ) {
	console.error( error.message );
	console.error( error.stack );
});
```

<a name="socket-events-close"></a>
#### 'close'

The socket emits a `close` event when the other end of the connection closes the socket. To register a listener,

``` javascript
socket.addListener( 'close', function onClose() {
	console.log( '...socket closed...' );
	console.log( '...attempting to reconnect in 5 seconds...' );
	setTimeout( function reconnect() {
		socket.connect();
	}, 5000 );
});
```

<a name="socket-events-warn"></a>
#### 'warn'

The socket emits a `warn` event when attempting to create a new socket connection when a connection already exists. To register a listener,

``` javascript
socket.addListener( 'warn', function onWarn( message ) {
	console.warn( message );
});
```





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



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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
$ make view-cov
```



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
