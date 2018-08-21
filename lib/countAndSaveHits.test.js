
jest.mock('./countFromDir')
jest.mock('./saveHits')
const countFromDir = require('./countFromDir')
const saveHits = require('./saveHits')
const countAndSaveHits = require('./countAndSaveHits')

const directory = './directory'
const uri = 'mongodb://example.com'
const db = 'ebl'
const hits = {'K.1': 5}

test('Counts from given dir and saves to Mongo', async () => {
  countFromDir.mockReturnValue(hits)
  saveHits.mockResolvedValue()

  await countAndSaveHits(directory, uri, db)

  expect(saveHits).toHaveBeenCalledWith(hits, uri, db)
})
