const {MongoClient} = require('mongodb')
const _ = require('lodash')

module.exports = async function saveHits (hits, uri, database) {
  const client = await MongoClient.connect(uri)
  const db = await client.db(database)
  const fragments = db.collection('fragments')

  const operations = _.map(hits, (hits, id) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { hits: hits } }
    }
  }))

  await fragments.bulkWrite(operations, {ordered: false})
}
