
const _ = require('lodash')

class Citation {
  static mergeAll (citations) {
    return _(citations)
      .tail()
      .reduce(
        (merged, citation) => merged.merge(citation),
        _.head(citations)
      )
  }

  constructor (document, pages) {
    this.document = document
    this.pages = pages
  }

  merge (citation) {
    if (this.document === citation.document) {
      return new Citation(
        this.document,
        _(this.pages).union(citation.pages).sortBy().value()
      )
    } else {
      throw new Error(`Incompatible documents: "${this.document}" and "${citation.document}".`)
    }
  }
}

module.exports = Citation
