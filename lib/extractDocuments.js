const _ = require('lodash')
const Papa = require('papaparse')
const Reference = require('./Reference')

function createReference ([document, title, page]) {
  return new Reference(
    document.replace(/.pdf$/, ''),
    [page].filter(page => /\d+/.test(page)).map(_.toNumber)
  )
}

module.exports = function countHits (catalog) {
  return _(catalog)
    .split('\n')
    .drop(9)
    .reject(line => /^\s*$/.test(line))
    .reject(line => /"?File name"?[,;]"Title"[,;]"Page"[,;]"Search Instance"/.test(line))
    .reject(line => /"?Dateiname"?;"Titel";"Seite";"Suchvorkommen"/.test(line))
    .reject(line => /^"?BC .+\.pdf/.test(line))
    .map(line => _.take(Papa.parse(line, { delimiter: ';' }).data[0], 3))
    .map(createReference)
    .groupBy('document')
    .mapValues(Reference.mergeAll)
    .values()
    .value()
}
