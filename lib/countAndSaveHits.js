const countFromDir = require('./countFromDir')
const saveHits = require('./saveHits')

module.exports = async function countAndSaveHits (directory, uri, db) {
  const hits = countFromDir(directory)
  await saveHits(hits, uri, db)
}
