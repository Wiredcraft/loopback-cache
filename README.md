# loopback-cache
Cache solutions for Loopback.

# How to deploy and test

- npm i

- Make sure redis server is running on `127.0.0.1:6379`(by default)

- Set your `TTL`:

```
var config = {
	ttl: 20  //seconds
};
```

- npm test
