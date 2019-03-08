const Reference = require('./Reference')

const document = 'a document'

test('Construction', () => {
  const pages = [3]
  expect(new Reference(document, pages)).toEqual({ document, pages })
})

test('Merging', () => {
  const citations = [
    new Reference(document, [3]),
    new Reference(document, [4, 3]),
    new Reference(document, [1])
  ]
  expect(Reference.mergeAll(citations)).toEqual(new Reference(document, [1, 3, 4]))
})
