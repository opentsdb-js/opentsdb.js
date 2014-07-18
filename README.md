OpenTSDB
========

JavaScript client library to interface with OpenTSDB.



### Install

For use in Node.js,

``` bash
$ npm install opentsdb
```

For use in the browser, use browserify.



### Client





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