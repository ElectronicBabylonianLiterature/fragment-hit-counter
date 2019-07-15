const _ = require('lodash')

function parseCollection (collection) {
  return collection
    ? ['Rm 2', 'Rm II'].includes(collection)
      ? 'Rm-II'
      : collection
    : 'K'
}

function createCollectionName (match) {
  const collection = parseCollection(match.groups.collection)
  const number = _.trimStart(match.groups.number, '0')
  return `${collection}.${number}`
}

function createDateName (match) {
  const year = `18${match.groups.year}`
  const month = match.groups.month.padStart(2, '0')
  const day = match.groups.day.padStart(2, '0')
  const number = _.trimStart(match.groups.number, '0')
  return `${year},${month}${day}.${number}`
}

module.exports = function mapName (fileName) {
  const collectionPattern = /^(?:(?<collection>Sm|DT|Rm|Rm 2|Rm II|BM|CBS|N|UM) )?(?<number>\d+)\.csv$/
  const collectionMatch = collectionPattern.exec(fileName)
  const datePattern = /^(?<year>\d{2})-(?<month>\d{1,2})-(?<day>\d{1,2})[ ,](?<number>\d+)\.csv$/
  const dateMatch = datePattern.exec(fileName)

  if (collectionMatch) {
    return createCollectionName(collectionMatch)
  } else if (dateMatch) {
    return createDateName(dateMatch)
  } else {
    return null
  }
}
