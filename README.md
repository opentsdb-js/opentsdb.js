OpenTSDB
========

JavaScript client library to interface with OpenTSDB.


### Install

``` bash
$ npm install opentsdb.io
```


### Client

(...)


### Queries

(...)


### Polling

(...)


### Notes

(...)


### Tests

To generate a test coverage report, install [Istanbul](https://github.com/gotwarlost/istanbul)

``` bash
$ npm install -g istanbul
```

and, once installed, generate the report.

``` bash
$ istanbul cover _mocha --dir ./reports/coverage -- -R spec
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report

``` bash
$ open reports/coverage/lcov-report/index.html
```
