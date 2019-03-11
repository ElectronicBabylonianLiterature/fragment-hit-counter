const _ = require('lodash')
const Reference = require('./Reference')

function createReference () {
  return ([document, title, page]) => new Reference(
    _.trim(document, '"').replace(/.pdf$/, ''),
    [Number(_.trim(page, '"'))]
  )
}

module.exports = function countHits (catalog) {
  return _(catalog)
    .split('\n')
    .drop(9)
    .reject(line => /^\s*$/.test(line))
    .reject(line => /"?File name"?;"Title";"Page";"Search Instance"/.test(line))
    .reject(line => /^"?BC .+\.pdf/.test(line))
    .map(line => _(line).split(';').take(3))
    .map(createReference())
    .groupBy('document')
    .mapValues(Reference.mergeAll)
    .values()
    .value()
}
