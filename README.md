OpenTSDB
========
[![Coverage Status](https://img.shields.io/coveralls/kgryte/opentsdb.js.svg)](https://coveralls.io/r/kgryte/opentsdb.js?branch=master)

JavaScript [OpenTSDB](http://opentsdb.net) client library.



### Install

For use in Node.js,

``` bash
$ npm install opentsdb
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).



### Client

To interface with OpenTSDB, one must first create a client.
To do so,

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

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have installed Mocha,

``` bash
$ npm install -g mocha
```

execute the following command in the top-level application directory to run the tests:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

Assuming you have installed [Istanbul](https://github.com/gotwarlost/istanbul),

``` bash
$ npm install -g istanbul
```

execute the following command to generate a test coverage report:

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