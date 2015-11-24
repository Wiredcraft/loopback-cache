# loopback-cache

[![build status][travis-image]][travis-url]

Cache solutions for Loopback.

# How to deploy and test

- npm i

- Make sure that 
	- Redis is running on `127.0.0.1:6379`(by default)
	- Couchbase is running on `couchbase://localhost`(by default)

- Set your config:

```
options = {
  backend: 'redis',
  ttl: 3  //seconds
};
```

- npm test

[travis-image]: https://img.shields.io/travis/Wiredcraft/loopback-cache/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/Wiredcraft/loopback-cache
