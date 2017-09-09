const mongoose = require('mongoose');
const chai = require('chai');
const dataConstructor = require('../db/dataConstructor');
const generateKey = require('../libs/generateKey')
const debug = require('debug');
const log = debug('debug');

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const {Data, Drafts} = require('../db/model');


describe("DATA CONSTRUCTOR TEST SESSION", () => {
  let openDB, closeDB;
  before(() => {
    if (process.env.NODE_ENV !== "nodb") {
      // connect to database for testing purpose
      const {open, close} = require('../db');
      openDB = open;
      closeDB = close;
      openDB('mongodb://localhost/keys-api');
    }
  })
  after(() => {
    if (process.env.NODE_ENV !== "nodb") {
      closeDB();
    }
  });
  // remove items
  describe('Data.delete, Drafts.delete', () => {
    it('should delete all items', function(done) {
      this.timeout(5000);
      (async () => {
        Data.delete({key: '*'}, () => {
          Data.get((result) => {
            expect(result).to.be.a("array").that.is.empty;
            log({test: 'Data.delete({})', result})
          });
        });

        Drafts.delete({key: '*'}, () => {
          Drafts.get((result) => {
            expect(result).to.be.a("array").that.is.empty;
            log({test: 'Drafts.delete({})', result})
          });
        });
      })()
      setTimeout(done, 1000)
    });
  });

  // generate random keys
  describe('Data.random', () => {
    it('should generate 2 random items', function(done) {
      this.timeout(5000);
      (async () => {
        const result = await Data.random(2);
        expect(result).to.be.a("array");
        result.map((res) => {
          expect(res).to.have.property("key");
        })
        log({test: 'Data.random()', result})
      })();

      setTimeout(done, 1000)
    });
  });

  // list data
  describe('Data.get', () => {
    it('should list items', function(done) {
      this.timeout(5000);
      (async () => {
        const result = await Data.get();
        expect(result).to.be.a("array");
        result.map((res) => {
          expect(res).to.have.property("key");
        })
        log({test: 'Data.get()', result})
      })();

      setTimeout(done, 1000)
    });
  });

  // add new data
  describe('Data.add, Drafts.add', () => {
    it('should add new item', function(done) {
      this.timeout(5000);
      (async () => {
        const newData = {
          _id: generateKey("numOnly"),
          key: "testConstructor",
          value: "generate from test file",
          timestamp: Math.floor(new Date() / 1000)
        }
        Data.add(newData, (data) => {
          expect(data).to.be.a("object");
          expect(data).to.have.property("key");
          log({test: 'Data.add()', data})
        });

        Drafts.add(newData, (data) => {
          expect(data).to.be.a("object");
          expect(data).to.have.property("key");
          log({test: 'Drafts.add()', data})
        });
      })();

      setTimeout(done, 1000)
    });

    it('should add array of items', function(done) {
      this.timeout(5000);
      (async () => {
        const newArray = [
          {
            _id: generateKey("numOnly"),
            key: "testConstructorArray1",
            value: "array item 1 generate from test file",
            timestamp: Math.floor(new Date() / 1000)
          },
          {
            _id: generateKey("numOnly"),
            key: "testConstructorArray2",
            value: "array item 2 generate from test file",
            timestamp: Math.floor(new Date() / 1000)
          }
        ]
        Data.add(newArray, (data) => {
          expect(data).to.be.a("object");
          expect(data).to.have.property("key");
          log({test: 'Data.add()', data})
        });

        Drafts.add(newArray, (data) => {
          expect(data).to.be.a("object");
          expect(data).to.have.property("key");
          log({test: 'Drafts.add()', data})
        });
      })();

      setTimeout(done, 1000)
    })
  });

  // find item
  describe('Data.find', () => {
    it('should find item, match with query', function(done) {
      this.timeout(5000);
      (async () => {
        const result = await Data.find('key', 'testConstructor');
        expect(result).to.be.a("array");
        result.map((res) => {
          expect(res).to.have.property("key");
        })
        log({test: 'Data.find()', result})
      })();

      setTimeout(done, 1000)
    });
  });

  // update item
  describe('Data.update', () => {
    it('should update item, match with query', function(done) {
      this.timeout(5000);
      (async () => {
        const newData = {
          _id: generateKey("numOnly"),
          key: "testConstructor",
          value: "update from test file",
          timestamp: Math.floor(new Date() / 1000)
        }
        Drafts.add(newData);
        const result = await Data.update('key', 'testConstructor', newData);
        expect(result).to.be.a("object");
        expect(result).to.have.property("key");
        log({test: 'Data.update()', result})
      })();

      setTimeout(done, 1000)
    });
  });

})
