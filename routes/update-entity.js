const {Data, Drafts} = require('../db/model');

module.exports = async (req, res) => {
  const obj = req.body;
  let result;
  let newData;

  for (key in obj) {

    Data.findOne({'key': key}, (err, doc) => {
      // check if key already exist
      if (!doc) {
        //if no key match in databse, create new document in database
        const newData = {
          key: Object.keys(obj)[0],
          value: obj[key],
          timestamp: Math.floor(new Date(Date.now()) / 1000)
        }

        const draft = new Drafts(newData); // create draft item and push to drafts
        draft.save().then((draft) => {
          console.info('new draft saved', draft);
        });

        // update database
        const update = new Data(newData);
        update.save().then((update) => {
          res.status(200).send({data: update});
        });

      } else { // if key exist update document and create draft

        const draftData = Object.assign({}, result); // create draft item and push to drafts
        const update = new Drafts(draftData);
        update.save().then((update) => {
          console.info('new draft saved', update)
        });

        // update document
        Data.findOneAndUpdate({'key': key}, {'$set': {
          value: obj[key],
          timestamp: Date.now()
        }}, (err, doc) => {
          if (err)
            throw err
          res.status(200).send({data: doc});
        })
      }
    });
  }
}
