
const _ = require('lodash')

class Reference {
  static mergeAll (references) {
    return _(references)
      .tail()
      .reduce(
        (merged, citation) => merged.merge(citation),
        _.head(references)
      )
  }

  constructor (document, pages) {
    this.document = document
    this.pages = pages
  }

  merge (reference) {
    if (this.document === reference.document) {
      return new Reference(
        this.document,
        _(this.pages).union(reference.pages).sortBy().value()
      )
    } else {
      throw new Error(`Incompatible documents: "${this.document}" and "${reference.document}".`)
    }
  }
}

module.exports = Reference
