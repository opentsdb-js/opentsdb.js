TODO
====


### General

1. 	Incorporate polling
2. 	Push data (Bixby)
3. 	Add annotations support
4. 	Method to get metric list
5. 	Method to get aggregators
6. 	Instrument logging (e.g., get_response.js )
7. 	Include browserify instructions; client-side demo.


### Queries

1. 	Check how this kind of query works, where both queries ask for all individual timeseries.

```
http://127.0.0.1:4242/api/query?ms=false&arrays=false&showTSUIDs=true&start=1405846191093&end=1405846192093&m=sum:rate{true,10000,5}:5m-avg:cpu.utilization{nid=*}&m=sum:5m-avg:mem.utilization{nid=*}
```


### Tests

1. 	

