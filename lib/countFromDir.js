const fs = require('fs')
const _ = require('lodash')
const ProgressBar = require('progress')
const countHits = require('./countHits')
const mapNames = require('./mapNames')

function countFromFile (fileName) {
  const contents = fs.readFileSync(fileName)
  return countHits(contents)
}

module.exports = function countFromDir (directory) {
  const files = fs.readdirSync(directory)
  const bar = new ProgressBar(`${_.padEnd('Parsing files', 32)} [:bar] :percent :etas`, {total: files.length, width: 50, renderThrottle: 1000})
  return _(files)
    .map(file => {
      const fragmentId = mapNames(file)
      const fileName = `${directory}/${file}`
      bar.tick()
      return fragmentId
        ? [fragmentId, countFromFile(fileName)]
        : null
    })
    .compact()
    .fromPairs()
    .value()
}
