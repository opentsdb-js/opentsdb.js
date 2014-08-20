TODO
====


### General

1. 	setTimeout/setInterval
2. 	Push data (Bixby)
3. 	assign route (assign metrics and cache uids)
4. 	Should pagination of metric list be supported? or ability to supply suggestion; e.g., cpu.cp, net.util, mem., etc, just as one does in the search box?
5. 	annotations get route; may need something similar to mQuery, tQuery for annotations: aQuery!. Also support for put, post, delete.
6. 	Instrument logging (e.g., get_response.js ) --> should we instrument logging, or leave this to the client?
7. 	Include browserify instructions; client-side demo.
8. 	Add a ToC to the README.
9. 	
10. db stats query route (ability to poll; allow for monitoring) (http://opentsdb.net/docs/build/html/user_guide/stats.html) --> this should be separate module
11. tsmeta data routes (e.g., get units, notes, displayName)
12. uidmeta data route
13. split components into separate repos and simply glue them together in this library. Each component as separate module. Should still include the complete documentation here.
	- components:
		- 	socket
		- 	datum
		- 	client (w/interval)
		- 	opentsdb.js
		-	s-server
		- 	stats (see #10)
14. method to set type checking flag for `write`; default `true`



### Tests

1. 	Valid ip or localhost for host (socket/client)

