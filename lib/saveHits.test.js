const { MongoClient } = require('mongodb')
const saveHits = require('./saveHits')
const Reference = require('./Reference')
const { promisify } = require('util')
const fs = require('fs')

const readFileAsync = promisify(fs.readFile)
const unlinkAsync = promisify(fs.unlink)

let client
let db

beforeAll(async () => {
  client = await MongoClient.connect(global.__MONGO_URI__)
  db = await client.db(global.__MONGO_DB_NAME__)
})

afterAll(async () => {
  await client.close()
})

describe('saveHits', () => {
  test('should update documents in MongoDB', async () => {
    const fragments = db.collection('fragments')

    await fragments.insertMany([
      { _id: 'K.1' },
      { _id: 'K.2' }
    ])

    const hits = [{ _id: 'K.1', uncuratedReferences: [new Reference('a document', [56, 89])] }]
    await saveHits(hits, true, null, global.__MONGO_URI__, global.__MONGO_DB_NAME__)

    const updatedFragments = await fragments.find({}).toArray()
    expect(updatedFragments).toEqual([
      { _id: 'K.1', uncuratedReferences: hits[0].uncuratedReferences },
      { _id: 'K.2' }
    ])
  })

  test('should save JSON to file', async () => {
    const output = 'test-output.json'

    const hits = [{ _id: 'K.1', uncuratedReferences: [new Reference('a document', [56, 89])] }]
    await saveHits(hits, true, output)

    const fileContents = await readFileAsync(output, 'utf8')
    const savedJSON = JSON.parse(fileContents)

    expect(savedJSON).toEqual(hits)

    await unlinkAsync(output)
  })

  test('should throw error if output file is specified but no MongoDB URI or database is provided', async () => {
    const hits = [{ _id: 'K.1', uncuratedReferences: [new Reference('a document', [56, 89])] }]
    const output = 'test-output.json'

    try {
      await saveHits(hits, true, output)
    } catch (error) {
      expect(error.message).toBe('MongoDB URI and database must be provided')
    }
  })

  test('should not throw error if MongoDB URI and database are not provided and output file is not specified', async () => {
    const hits = [{ _id: 'K.1', uncuratedReferences: [new Reference('a document', [56, 89])] }]

    try {
      await saveHits(hits, true)
    } catch (error) {
      expect(error).toBeUndefined()
    }
  })
})
