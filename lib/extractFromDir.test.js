jest.mock('./extractDocuments')
const fs = require('fs')
const _ = require('lodash')
const extractFromDir = require('./extractFromDir')
const extractDocuments = require('./extractDocuments')

const files = {
  '00001.csv': 'K.1 mock file',
  'Rm 2 99999.csv': 'Rm 2 99999 mock file',
  'Rm II 99999.csv': 'Rm II 99999 mock file'
}
const documents = {
  [files['00001.csv']]: [
    { document: 'Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', pages: [2] },
    { document: 'Johns 1898 Assyrian Deeds and Documents ADD 1-3', pages: [4] }
  ],
  [files['Rm 2 99999.csv']]: [
    { document: 'Abcd 123', pages: [1] },
    { document: 'Abcd 456', pages: [3] }
  ],
  [files['Rm II 99999.csv']]: [
    { document: 'Abcd 123', pages: [1, 2] },
    { document: 'Abcd 999', pages: [4] }
  ]
}
const directory = './directory'

let result

beforeEach(() => {
  jest.spyOn(fs, 'readdirSync').mockReturnValue(_.keys(files).concat('invalid.xlsx'))
  jest.spyOn(fs, 'readFileSync').mockImplementation(fileName => files[fileName.slice(directory.length + 1)])
  extractDocuments.mockImplementation(catalog => documents[catalog])
  result = extractFromDir(directory)
})

test('Counts hits from all the files in the folder', () => {
  expect(result).toEqual({
    'K.1': [
      { document: 'Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', pages: [2] },
      { document: 'Johns 1898 Assyrian Deeds and Documents ADD 1-3', pages: [4] }
    ],
    'Rm-II.99999': [
      { document: 'Abcd 123', pages: [1, 2] },
      { document: 'Abcd 456', pages: [3] },
      { document: 'Abcd 999', pages: [4] }
    ]
  })
})

test('Loads correct files', () => {
  expect(fs.readFileSync.mock.calls).toEqual(_.keys(files).map(file => [`${directory}/${file}`]))
})
