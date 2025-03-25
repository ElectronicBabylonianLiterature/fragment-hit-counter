const _ = require('lodash')

class IdMapper {
  constructor (pattern, factory) {
    this.pattern = pattern
    this.factory = factory
    this.match = null
  }

  createMatch (fileName) {
    this.match = this.pattern.exec(fileName)
    return this.getId()
  }

  getId () {
    return this.match && this.factory(this.match)
  }
}

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

function createPennMuseumName (match) {
  const collection = parseCollection(match.groups.collection)
  const number = match.groups.number
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
  const id = [
    new IdMapper(
      /^(?:(?<collection>Sm|DT|Rm|Rm 2|Rm II|BM|CBS|N|UM|LB|A|BE|Bab) )?(?<number>.+)\.csv$/,
      createCollectionName
    ),
    new IdMapper(
      /^(?<collection>CBS|N|UM|Ni|Si|HS|VAT|ANT|AOS-1|DavidAstr|EAH|GCBC|Lager|MLC|NCBS|NCBT|Newell|Ott-Seal|Ott-Tablet|RBC|YBC|LB|A|IM) (?<number>.+)\.csv$/,
      createPennMuseumName
    ),
    new IdMapper(
      /^(?<year>\d{2})-(?<month>\d{1,2})-(?<day>\d{1,2})[ ,](?<number>\d+)\.csv$/,
      createDateName
    )
  ].map(mapper => mapper.createMatch(fileName)).find(_.negate(_.isNil))

  return id || null
}
