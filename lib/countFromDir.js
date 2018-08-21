const fs = require('fs')
const _ = require('lodash')
const countHits = require('./countHits')
const mapNames = require('./mapNames')

module.exports = function countFromDir (directory) {
  const files = fs.readdirSync(directory)
  return _(files).map(file => {
    const contents = fs.readFileSync(`${directory}/${file}`)
    const fragmentId = mapNames(file)
    const hits = countHits(contents)
    return [fragmentId, hits]
  }).fromPairs().value()
}
