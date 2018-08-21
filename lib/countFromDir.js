const fs = require('fs')
const _ = require('lodash')
const countHits = require('./countHits')
const mapNames = require('./mapNames')

function countFromFile (fileName) {
  const contents = fs.readFileSync(fileName)
  return countHits(contents)
}

module.exports = function countFromDir (directory) {
  const files = fs.readdirSync(directory)
  return _(files)
    .map(file => {
      const fragmentId = mapNames(file)
      const fileName = `${directory}/${file}`
      return fragmentId
        ? [fragmentId, countFromFile(fileName)]
        : null
    })
    .compact()
    .fromPairs()
    .value()
}
