
jest.mock('./extractFromDir')
jest.mock('./saveHits')
const extractFromDir = require('./extractFromDir')
const saveHits = require('./saveHits')
const countAndSaveHits = require('./countAndSaveHits')

const directory = './directory'
const uri = 'mongodb://example.com'
const db = 'ebl'
const documents = { 'K.1': ['a document'] }

test('Extracts from given dir and saves to Mongo', async () => {
  extractFromDir.mockReturnValue(documents)
  saveHits.mockResolvedValue()

  await countAndSaveHits(directory, uri, db)

  expect(saveHits).toHaveBeenCalledWith(documents, uri, db)
})
