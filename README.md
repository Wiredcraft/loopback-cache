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

To use the `redis` backend, setup a model using the [redis connector](https://github.com/strongloop/loopback-connector-redis) or the [ioredis connector](https://github.com/Wiredcraft/loopback-connector-ioredis) and use the mixin `CacheModel` with the model. The TTL is in seconds, see http://redis.io/commands/expire.

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

To use the `couchbase` backend, setup a model using the [couchbase3 connector](https://github.com/Wiredcraft/loopback-connector-couchbase3) and use the mixin `CacheModel` with the model. The TTL is in seconds usually but also has a special case, see http://docs.couchbase.com/sdk-api/couchbase-node-client-2.1.2/Bucket.html#touch.

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

## Extending

__Note:__ This module doesn't do anything on the DB or table level. For example MongoDB would require a special index that matches the field, which should be prepared before you start the application.

To add the support for a specific connector (it's a model mixin so we are talking connectors not DB directly), extend this module in a place that will be executed (for example `boot`).

```
var loopbackCache = require('loopback-cache');
```

And add a new backend (you can also override backends). See https://github.com/Wiredcraft/loopback-cache/tree/master/backends for examples.

```
loopbackCache.backends.something = function(Model, options) {};
```

Now you can use it in the model JSON, same as any other backend.

```
{
  "mixins": {
    "CacheModel": {
      "backend": "something",
      "ttl": 3600
    }
  }
}
```

## Contributing

If you want to add a new backend to the module, just drop the file in the `backends` directory, and send us a PR.

## Git Summary

```
 project  : loopback-cache
 repo age : 11 months
 active   : 16 days
 commits  : 46
 files    : 18
 authors  :
    22  CCharlieLi   47.8%
    22  Makara Wang  47.8%
     2  fraserxu     4.3%
```
