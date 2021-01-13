"use strict";

require("should");
const { isCouchbaseVersionSupported } = require("../utils/couchbase.js");

describe("Couchbase Utils", () => {
  describe("isCouchbaseVersionSupported", () => {
    it("it should return true for couchbase3", () => {
      const isSupported = isCouchbaseVersionSupported("couchbase3");
      isSupported.should.equal(true);
    });

    it("it should return true for couchbase5", () => {
      const isSupported = isCouchbaseVersionSupported("couchbase5");
      isSupported.should.equal(true);
    });

    it("it should return true for couchbaseX", () => {
      const isSupported = isCouchbaseVersionSupported("couchbaseX");
      isSupported.should.equal(true);
    });

    it("it should return false for couchbase1 (not supported)", () => {
      const isSupported = isCouchbaseVersionSupported("couchbase1");
      isSupported.should.equal(false);
    });
  });
});
