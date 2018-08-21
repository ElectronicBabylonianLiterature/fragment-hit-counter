const _ = require('lodash')

module.exports = function countHits (catalog) {
  return _(catalog)
    .split('\n')
    .drop(9)
    .reject(line => /^\s*$/.test(line))
    .reject(line => /File name;"Title";"Page";"Search Instance"/.test(line))
    .reject(line => /^BC .+\.pdf/.test(line))
    .map(line => _(line).split(';').head())
    .uniq()
    .size()
}