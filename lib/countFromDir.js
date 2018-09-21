const fs = require('fs')
const _ = require('lodash')
const ProgressBar = require('progress')
const countHits = require('./countHits')
const mapNames = require('./mapNames')

function countFromFile (fileName) {
  const contents = fs.readFileSync(fileName)
  return countHits(contents)
}

const sumCounts = _.partial(_.sumBy, _, 'count')

module.exports = function countFromDir (directory) {
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
          count: countFromFile(fileName)
        }
        : null
    })
    .compact()
    .groupBy('number')
    .mapValues(sumCounts)
    .value()
}
