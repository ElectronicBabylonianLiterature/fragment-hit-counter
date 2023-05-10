const fs = require('fs')
const _ = require('lodash')
const windows1252 = require('windows-1252')
const ProgressBar = require('progress')
const extractDocuments = require('./extractDocuments')
const mapNames = require('./mapNames')
const Reference = require('./Reference')

function extractFromFile (fileName) {
  const contents = fs.readFileSync(fileName, { encoding: 'latin1' })
  const utf8Contents = windows1252.decode(contents)
  const delimiter = contents.includes(';') ? ';' : ','
  const csvContents = utf8Contents.replace(new RegExp(delimiter, 'g'), ';')
  return extractDocuments(csvContents)
}

function extractFromFile(fileName) {
  const contents = fs.readFileSync(fileName, { encoding: 'latin1' });
  const utf8Contents = windows1252.decode(contents);
  const replacedContents = utf8Contents.replace(/,/g, ';');
  return extractDocuments(replacedContents);
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
