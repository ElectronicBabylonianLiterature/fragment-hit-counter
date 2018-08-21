const _ = require('lodash')

function parseCollection (collection) {
  return collection
    ? ['Rm 2', 'Rm II'].includes(collection)
      ? 'Rm-II'
      : collection
    : 'K'
}

module.exports = function mapName (fileName) {
  const fileNamePattern = /^(?:(?<collection>.+) )?(?<number>\d{5})\.csv$/
  const match = fileNamePattern.exec(fileName)
  const collection = parseCollection(match.groups.collection)
  const number = _.trimStart(match.groups.number, '0')
  return `${collection}.${number}`
}
