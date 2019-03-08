const fs = require('fs')
const _ = require('lodash')
const ProgressBar = require('progress')
const extractDocuments = require('./extractDocuments')
const mapNames = require('./mapNames')

function extractFromFile (fileName) {
  const contents = fs.readFileSync(fileName)
  return extractDocuments(contents)
}

const flattenDocuments = array => _(array)
  .map('documents')
  .flatten()
  .groupBy('document')
  .mapValues(documents => _(documents)
    .map('pages')
    .flatten()
    .uniq()
    .sort()
    .value()
  )
  .toPairs()
  .map(([document, pages]) => ({
    document,
    pages
  }))
  .value()

module.exports = function extractFromDir (directory) {
  const files = fs.readdirSync(directory)
  const bar = new ProgressBar(`${_.padEnd('Parsing files', 32)} [:bar] :percent :etas`, { total: files.length, width: 50, renderThrottle: 1000 })
  return _(files)
    .map(file => {
      const fragmentId = mapNames(file)
      const fileName = `${directory}/${file}`
      bar.tick()
      return fragmentId
        ? {
          number: fragmentId,
          documents: extractFromFile(fileName)
        }
        : null
    })
    .compact()
    .groupBy('number')
    .mapValues(flattenDocuments)
    .value()
}
