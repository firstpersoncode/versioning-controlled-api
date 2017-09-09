const mongoose = require('mongoose');
const chai = require('chai');
const dataConstructor = require('../db/dataConstructor');
const generateKey = require('../libs/generateKey')

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const testSchema = new mongoose.Schema({
  _id: String,
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date() / 1000)
  }
});

const Data = new dataConstructor(process.env.NODE_ENV === "nodb" ? [] : mongoose.model('Test', testSchema));

// generate random keys
describe('Data.random', () => {
  it('should generate random items', function(done) {
    this.timeout(5000);
    (async () => {
      const result = await Data.random(5);
      assert.ok(result);
      console.log({test: 'Data.random()', result})
    })();

    setTimeout(done, 2000)
  });
});

// list data
describe('Data.get', () => {
  it('should list items', function(done) {
    this.timeout(5000);
    (async () => {
      const result = await Data.get();
      assert.ok(result)
      console.log({test: 'Data.get()', result})
    })();

    setTimeout(done, 2000)
  });
});

// add new data
describe('Data.add', () => {
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
        assert.ok(data);
        console.log({test: 'Data.add()', data})
      });
    })();

    setTimeout(done, 2000)
  });
});

// find item
describe('Data.find', () => {
  it('should find item, match with query', function(done) {
    this.timeout(5000);
    (async () => {
      const result = await Data.find('key', 'testConstructor');
      assert.ok(result);
      console.log({test: 'Data.find()', result})
    })();

    setTimeout(done, 2000)
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
      const result = await Data.update('key', 'testConstructor', newData);
      assert.ok(result);
      console.log({test: 'Data.update()', result})
    })();

    setTimeout(done, 2000)
  });
});

// remove items
describe('Data.delete', () => {
  it('should delete all items', function(done) {
    this.timeout(5000);
    (async () => {
      Data.delete({}, () => {
        assert.ok(true);
        console.log({test: 'Data.delete({})'})
      });
    })()
    setTimeout(done, 2000)
  });
});
