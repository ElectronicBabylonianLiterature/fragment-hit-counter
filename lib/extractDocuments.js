const _ = require('lodash')

const documentProperty = 'document'
const pageProperty = 'page'

function createDocumentWithPage () {
  return ([document, title, page]) => ({
    [documentProperty]: _.trim(document, '"').replace(/.pdf$/, ''),
    [pageProperty]: Number(_.trim(page, '"'))
  })
}

function mergePages (array) {
  return _(array).map(pageProperty).union().value()
}

function createDocumentFromPair () {
  return ([document, pages]) => ({
    [documentProperty]: document,
    pages
  })
}

module.exports = function countHits (catalog) {
  return _(catalog)
    .split('\n')
    .drop(9)
    .reject(line => /^\s*$/.test(line))
    .reject(line => /"?File name"?;"Title";"Page";"Search Instance"/.test(line))
    .reject(line => /^"?BC .+\.pdf/.test(line))
    .reject(line => /^"?CAD[ _]/i.test(line))
    .map(line => _(line).split(';').take(3))
    .map(createDocumentWithPage())
    .groupBy(documentProperty)
    .mapValues(mergePages)
    .toPairs()
    .map(createDocumentFromPair())
    .value()
}
