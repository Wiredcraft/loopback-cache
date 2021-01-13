'use strict';


/**
 * converts ttl too epoch time
 * @param {*} ttl 
 */
const convertToAbsExpiry = (ttl) => {
    return Math.floor(Date.now() / 1000) + ttl;
}


/**
 * checked the couchbase version to determine if its supported 
 * currettly supports 3,5,X(5)
 * @param {*} version 
 */
exports.isCouchbaseVersionSupported = (version) => {
    // @see https://github.com/Wiredcraft/loopback-connector-couchbase3
    // @see https://github.com/Wiredcraft/loopback-connector-couchbaseX 
    return /^couchbase[35X]$/.test(version)
}


/**
 * @see http://docs.couchbase.com/sdk-api/couchbase-node-client-2.1.2/Bucket.html#touch
 * @param {*} ttl 
 */
exports.calculateExpiry = (ttl) => {
    if (ttl > 30 * 24 * 60 * 60) {
        return convertToAbsExpiry(ttl);
    }else{
        return ttl;
    }
}