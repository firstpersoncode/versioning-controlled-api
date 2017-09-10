const chai = require('chai');
const generateKey = require('../libs/generateKey');
const closest = require('../libs/closest');
const getRandomInt = require('../libs/getRandomInt');
const isFunction = require('../libs/isFunction');
const debug = require('debug')
const log = debug('debug')

const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

describe("LIBS TEST SESSION", () => {
  // generate random keys
  describe('generateKey', () => {
    it('should generate key "numOnly"', () => {
      const key = generateKey("numOnly");
      assert.equal(typeof key, "string");
      log({key});
    });
    it('should generate key with letters', () => {
      const key = generateKey();
      assert.equal(typeof key, "string");
      log({key});
    });
  });

  // closest
  describe('closest', () => {
    it('should return closest match number', () => {
      const array = [
        {timestamp: 1},
        {timestamp: 3},
        {timestamp: 7},
        {timestamp: 20}
      ]
      const query = 5;
      const key = 'timestamp';
      const res = closest(array, query, key);
      const exp = {
        compare: [
          {lowest: { timestamp: 3 }},
          {highest: { timestamp: 20 }},
        ],
        closest: { timestamp: 3 }
      };

      assert.equal(typeof res['compare'], 'object');
      assert.equal(res['closest']['timestamp'], exp['closest']['timestamp']);

      log({query, key, res});
    });
  });

  // generate random int
  describe('getRandomInt', () => {
    it('should generate random integers', () => {
      const num = getRandomInt(0, 15);
      assert.equal(typeof num, "number");
      log({num});
    });
    it('should equal to 0 or 1', () => {
      const num = getRandomInt(0, 1);
      assert.equal(num, num === 0 ? 0 : 1);
      log({num});
    });
  });

  // isFunction
  describe('isFunction', () => {
    it('should know if variable is a function', () => {
      const func = () => {};
      assert.equal(isFunction(func), true);
      log({isFunction: isFunction(func)});
    });
  });
})
