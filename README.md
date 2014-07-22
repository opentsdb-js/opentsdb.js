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

By default, the client host is `127.0.0.1` and port `4242`. To point to a remote host,

``` javascript
client.host( '192.168.92.11' );
```

and, to change the port,

``` javascript
client.port( 8080 );
```

To turn on millisecond resolution,

``` javascript
client.ms( true );
```

To set 


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