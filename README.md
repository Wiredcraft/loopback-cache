# loopback-cache

[![Build Status](https://travis-ci.org/Wiredcraft/loopback-cache.svg)](https://travis-ci.org/Wiredcraft/loopback-cache) [![Coverage Status](https://coveralls.io/repos/Wiredcraft/loopback-cache/badge.svg?branch=master&service=github)](https://coveralls.io/github/Wiredcraft/loopback-cache?branch=master)

Cache solutions for Loopback.

## How to use

### Install

```
npm install loopback-cache --save
```

### Config

To load the mixins.

```
# model-config.json
{
  "_meta": {
    ...
    "mixins": [
      ...
      "loopback-cache/mixins",
      ...
    ]
  },
  ...
}
```

To use the `redis` backend, setup a model using the [redis](https://github.com/strongloop/loopback-connector-redis) connector and use the mixin `CacheModel` with the model. The TTL is in seconds, see http://redis.io/commands/expire.

```
# The model JSON
{
  ...
  "mixins": {
    "CacheModel": {
      "backend": "redis",
      "ttl": 3600
    }
  },
  ...
}
```

To use the `couchbase` backend, setup a model using the [couchbase3](https://github.com/Wiredcraft/loopback-connector-couchbase3) connector and use the mixin `CacheModel` with the model. The TTL is in seconds usually but also has a special case, see http://docs.couchbase.com/sdk-api/couchbase-node-client-2.1.2/Bucket.html#touch.

```
# The model JSON
{
  ...
  "mixins": {
    "CacheModel": {
      "backend": "couchbase",
      "ttl": 3600
    }
  },
  ...
}
```

## Git Summary

```
 project  : loopback-cache
 repo age : 3 months
 active   : 12 days
 commits  : 33
 files    : 14
 authors  :
    20  CCharlieLi   60.6%
    11  Makara Wang  33.3%
     2  fraserxu     6.1%
```
