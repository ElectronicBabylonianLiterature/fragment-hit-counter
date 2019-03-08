const { MongoClient } = require('mongodb')
const saveHits = require('./saveHits')

let client
let db

beforeAll(async () => {
  client = await MongoClient.connect(global.__MONGO_URI__)
  db = await client.db(global.__MONGO_DB_NAME__)
})

afterAll(async () => {
  await client.close()
})

test('should aggregate docs from collection', async () => {
  const fragments = db.collection('fragments')

  await fragments.insertMany([
    { _id: 'K.1' },
    { _id: 'K.2' }
  ])

  const hits = { 'K.1': [{ document: 'a document', pages: [] }] }
  await saveHits(hits, global.__MONGO_URI__, global.__MONGO_DB_NAME__)

  const updatedFragments = await fragments.find({}).toArray()
  expect(updatedFragments).toEqual([
    { _id: 'K.1', hits: hits['K.1'] },
    { _id: 'K.2' }
  ])
})
