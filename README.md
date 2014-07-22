OpenTSDB
========

JavaScript OpenTSDB client library.



### Install

For use in Node.js,

``` bash
$ npm install opentsdb
```

For use in the browser, use browserify.



### Client

To interface with OpenTSDB, one must first create a client.
To do so,

``` javascript
var opentsdb = require( 'opentsdb' );

var client = opentsdb.client();
```

OpenTSDB clients are configurable and have the following methods...


#### client.host( [host] )

This method is a setter/getter. If no `host` is provided, the method returns the configured host. By default, the client host is `127.0.0.1`. To point to a remote host,

``` javascript
client.host( '192.168.92.11' );
```

#### client.port( [port] )

This method is a setter/getter. If no `port` is provided, the method returns the configured port. By default, the client port is `4242`. To set a different port,

``` javascript
client.port( 8080 );
```

#### client.ms( [bool] )

This method is a setter/getter. If no boolean flag is provided, the method returns the flag indicating whether time should be output at millisecond resolution. By default, millisecond resolution is on, so as to ensure timestamps are 13 digit Unix timestamps. To turn off millisecond resolution,

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

#### client.start( [time] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query start time. Before making an OpenTSDB query, a start time is _required_. To do so,

``` javascript
client.start( Date.now()-1000 );
```

#### client.end( [time | null] )

This method is a setter/getter. If no `time` is provided, the method returns the configured query end time. An end time is optional when making an OpenTSDB query. If no end time is set upon making a query, OpenTSDB defaults to the time at which the request is made.

``` javascript
client.end( Date.now() );
```

If at time `t1` you specify an end time and later decide at `t2` to make a request without specifying an end time, you can `null` the configuration value.

``` javascript
client.end( null );
```

#### client.queries( [query1, query2, query3,...] )

This method is a setter/getter. If no queries are provided, the method returns any previously set queries. Queries must be set before making an OpenTSDB data request. To create queries, see below.

``` javascript
client.queries( mQuery, mQuery, tQuery );
```

#### client.url()

Generate an OpenTSDB request URL based on a client's configuration. Both queries and a start time must have been set before running this method.

``` javascript
var url = client.url();
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



### Queries





### Polling




---
## Notes




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