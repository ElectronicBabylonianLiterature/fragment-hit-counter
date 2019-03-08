const fs = require('fs')
const _ = require('lodash')
const ProgressBar = require('progress')
const extractDocuments = require('./extractDocuments')
const mapNames = require('./mapNames')
const Reference = require('./Reference')

function extractFromFile (fileName) {
  const contents = fs.readFileSync(fileName)
  return extractDocuments(contents)
}

const mergeReferences = array => _(array)
  .map('references')
  .flatten()
  .groupBy('document')
  .mapValues(Reference.mergeAll)
  .values()
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
          references: extractFromFile(fileName)
        }
        : null
    })
    .compact()
    .groupBy('number')
    .mapValues(mergeReferences)
    .value()
}
