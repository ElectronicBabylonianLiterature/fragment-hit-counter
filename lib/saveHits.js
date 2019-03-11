const { MongoClient } = require('mongodb')
const _ = require('lodash')

module.exports = async function saveHits (data, uri, database) {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true })
  const db = await client.db(database)
  const fragments = db.collection('fragments')

  const operations = _.map(data, (references, id) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { uncuratedReferences: references } }
    }
  }))

  const result = await fragments.bulkWrite(operations, { ordered: false })
  console.log(result)
  await client.close()
}
