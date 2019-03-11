const extractFromDir = require('./extractFromDir')
const saveHits = require('./saveHits')

module.exports = async function countAndSaveHits (directory, uri, db) {
  const hits = extractFromDir(directory)
  await saveHits(hits, uri, db)
    .then(() => console.log('Done!'))
    .catch(console.error)
}
