const generateKey = require('../libs/generateKey');
const isFunction = require('../libs/isFunction');
const getRandomInt = require('../libs/getRandomInt');
const {validation, message} = require('../libs/validate');
/*
  MODEL CONSTRUCTOR

  - this.get
  const items = await this.get();
  items = [{...}, {...}, {...}, ...];

  - this.find
  accept params : 1. object property name
                  2. object property value
  const find = await this.find('key', 'myKey');
  find = {
    key: 'myKey',
    ...
  }

  - this.update
  accept params : 1. object property name
                  2. object property value
                  3. new object
                  4. callback
  const result = await this.update('key', 'myKey', {
    key: 'myKey',
    value: 'update value',
    ...
  }, callback);

  - this.random
  accept params : 1. total of generated keys
                  2. callback
  const result = await this.random(3, callback);
  result = [{...}, {...}, {...}, ...]

  - this.add
  accept params : 1. new object
                  2. callback
  this.add({
    key: 'newKey',
    value: 'new item',
    ...
  }, callback);

  - this.delete
  accept params : 1. query
                  2. callback
  this.delete({key: 'newKey'}, callback) // will delete newKey only
  this.delete({key: '*'}, callback) // will delete everything in collection
*/

class Model {
  constructor(model) {
    this._items = model;

    // generate if nodb
    if (process.env.NODE_ENV === "nodb") {
      this.add([
        {
          _id: "0123456789",
          key: "generatedFromServerNODB",
          value: "generate from server without db",
          timestamp: Math.floor(new Date() / 1000)
        },
        {
          _id: "1234567890",
          key: "generatedFromServerNODB2",
          value: "generate from server without db 2",
          timestamp: Math.floor(new Date() / 1000) + 5
        },
        {
          _id: "2345678901",
          key: "generatedFromServerNODB3",
          value: "generate from server without db 3",
          timestamp: Math.floor(new Date() / 1000) + 5
        }
      ]);
    }

    // return all items
    this.get = async (cb) => {
      if (process.env.NODE_ENV === "nodb") {
        if (isFunction(cb)) {
          cb(this._items)
        }
        return this._items;
      } else {
        return this._items.find({}, (err, data) => {
          if (err) throw err

          if (isFunction(cb)) {
            cb(data)
          }
          return data
        });
      }
    }

    // query item
    this.find = async (key = 'key', query) => {
      if (process.env.NODE_ENV === "nodb") {
        return this._items.filter((d) => d[key] === query)

      // with mongoDB
      } else {
        return this._items.find({[key]: query}, (err, data) => {
          if (err) throw err;
          return data
        });
      }
    }

    // update item in database, if the item not exist, add new one
    this.update = async (key = 'key', query, data, cb) => {
      // validate key name
      if (validation.invalidKey(query))
        return message.invalidKey;

      const addHelper = (newData) => {
        this.add(newData, (newItem) => {
          if (isFunction(cb)) cb(newItem)
        });
      }

      if (process.env.NODE_ENV === "nodb") {
        // check if key exist
        const res = await this.find(key, query);
        let result = res.pop();
        if (!result) {
          // update
          const newData = Object.assign({}, data, {_id: generateKey("numOnly")});
          addHelper(newData)
          return data

        } else {
          const index = this._items.findIndex(x => x.key === query);
          this._items.splice(index, 1, data);
          if (isFunction(cb)) cb(data)
          return data;
        }

      } else {
        const doc = await this._items.findOne({[key]: query});

        if (!doc) {
          // update database
          addHelper(data)
          return data

        } else { // if key exist update document

          // update document
          for (let k in data) {
            if (k !== key && k !== '_id') {
              await this._items.findOneAndUpdate({[key]: query}, {'$set': { [k]: data[k] }}, (err, update) => {
                if (err) throw err
                if (isFunction(cb)) cb(update)
              });
            }
          }
          return data
        }
      }
    }

    // generate random items in database
    this.random = async (count, cb) => {
      const max = 25;
      if (count > max) {
        return message.invalidCount
      }
      const countRes = count !== 'random' ? count : getRandomInt(5, max);
      for (let i = 0; i < countRes; i++) {

        const newData = {
          _id: generateKey("numOnly"),
          key: generateKey(),
          value: i,
          timestamp: Math.floor(new Date() / 1000) + (i * 5)
        }

        // init random key
        this.add(newData);
      }

      if (isFunction(cb)) {
        this.get((data) => {
          cb(data)
        });
      }

      const data = await this.get();
      return data;
    }

    this.random = this.random.bind(this);
    this.update = this.update.bind(this);
    this.find = this.find.bind(this);
    this.add = this.add.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
  }

  // add new item
  add(item, cb) {
    const addHelper = (newItem) => {
      const update = new this._items(newItem);
      update.save((err, data) => {
        if (err) throw err
        if (isFunction(cb)) cb(newItem)
      });
    }

    const pushHelper = (newItem) => {
      this._items.push(newItem);
      if (isFunction(cb)) cb(newItem)
    }

    if (process.env.NODE_ENV === "nodb") {
      if (item.length) {
        item.map((d) => {
          pushHelper(d)
        })
      } else {
        pushHelper(item)
      }

    } else {
      if (item.length) {
        item.map((d) => {
          addHelper(d);
        })
      } else {
        addHelper(item);
      }
    }
  }

  // delete item
  delete(query, cb) {
    // if query is empty object, remove all items in database
    if (query.key === "*") {
      if (process.env.NODE_ENV === "nodb") {
        this._items.splice(0, this._items.length);
        if (isFunction(cb)) cb(this._items)
      } else {
        this._items.remove({}, (err) => {
          if (err) throw err
          if (isFunction(cb)) cb(this._items)
        })
      }
    } else {
      if (process.env.NODE_ENV === "nodb") {
        for (let k in query) {
          const newArray = this._items.filter((obj) => obj[k] !== query[k]);
          this._items = newArray;
          if (isFunction(cb)) cb(query)
        }
      } else {
        this._items.remove(query, (err, data) => {
          if (err) throw err
          if (isFunction(cb)) cb(data)
        });
      }
    }
  }
}

module.exports = Model;
