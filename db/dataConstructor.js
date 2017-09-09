const generateKey = require('../libs/generateKey');
const isFunction = require('../libs/isFunction');
const getRandomInt = require('../libs/getRandomInt');

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
  this.delete({}, callback) // will delete everything in collection
*/

class dataConstructor {
  constructor(model) {
    this.items = model;

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
          cb(this.items)
        } else {
          return this.items;
        }
      } else {
        return this.items.find({}, (err, data) => {
          if (err)
            throw err

          if (isFunction(cb)) {
            cb(data)
          } else {
            return data
          }
        });
      }
    }

    // query item
    this.find = async (key = 'key', query) => {
      if (process.env.NODE_ENV === "nodb") {
        return this.items.filter((d) => d[key] === query);

      // with mongoDB
      } else {
        return this.items.find({[key]: query}, (err, data) => {
          if (err)
            throw err;

          return data
        });
      }
    }

    // update item in database, if the item not exist, add new one
    this.update = async (key = 'key', query, data, cb) => {

      if (process.env.NODE_ENV === "nodb") {
        // check if key exist
        const awaitRes = await this.find(key, query);
        let result = awaitRes.pop();
        if (!result) {
          // update
          const newData = Object.assign({}, data, {_id: generateKey("numOnly")});
          this.add(newData, (update) => {
            if (isFunction(cb))
              cb(update)
          });

          return data
        } else {
          const index = this.items.findIndex(x => x.key === query);
          this.items.splice(index, 1, data)

          if (isFunction(cb))
            cb(data)

          return data;
        }


      } else {
        const doc = await this.items.findOne({[key]: query});

        if (!doc) {
          // update database
          this.add(data, (update) => {
            if (isFunction(cb))
              cb(update)
          });

          return data
        } else { // if key exist update document

          // update document
          for (let k in data) {
            if (k !== key && k !== '_id') {
              await this.items.findOneAndUpdate({[key]: query}, {'$set': {
                // key: data[key],
                // _id: data._id,
                // value: data.value,
                // timestamp: data.timestamp
                [k]: data[k],
              }}, (err, update) => {
                if (err)
                  throw err

                if (isFunction(cb))
                  cb(update)
              });
            }
          }
          return data
        }
      }
    }

    // generate random items in database
    this.random = async (count, cb) => {
      const countRes = count !== 'random' ? count : getRandomInt(5, 25);
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
    if (process.env.NODE_ENV === "nodb") {
      if (item.length) {
        item.map((d) => {
          this.items.push(d);
          if (isFunction(cb))
            cb(d)
        })
      } else {
        this.items.push(item);
        if (isFunction(cb))
          cb(item)
      }

    } else {
      if (item.length) {
        item.map((d) => {
          const update = new this.items(d);
          update.save((err, data) => {
            if (err)
              throw err

            if (isFunction(cb))
              cb(d)
          });
        })
      } else {
        const update = new this.items(item);
        update.save((err, data) => {
          if (err)
            throw err

          if (isFunction(cb))
            cb(data)
        });
      }

    }
  }

  // delete item
  delete(query, cb) {
    // if query is empty object, remove all items in database
    if (Object.keys(query).length === 0 && query.constructor === Object) {
      if (process.env.NODE_ENV === "nodb") {
        this.items = [];
        if (isFunction(cb))
          cb()
      } else {
        this.items.remove({}, (err) => {
          if (err)
            throw err
          if (isFunction(cb))
            cb()
        })
      }
    } else {
      if (process.env.NODE_ENV === "nodb") {
        for (key in query) {
          const newArray = this.items.filter((obj) => {
            return obj[key] !== query[key];
          });

          this.items = newArray;
          if (isFunction(cb))
            cb(newArray)
        }

      } else {
        this.items.remove(query, (err, data) => {
          if (err)
            throw err
          if (isFunction(cb))
            cb(data)
        });
      }
    }
  }
}

module.exports = dataConstructor;
