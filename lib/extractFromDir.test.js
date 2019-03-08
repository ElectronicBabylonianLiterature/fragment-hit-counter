jest.mock('./extractDocuments')
const fs = require('fs')
const _ = require('lodash')
const extractFromDir = require('./extractFromDir')
const extractDocuments = require('./extractDocuments')

const files = {
  '00001.csv': 'K.1 mock file',
  'Rm 2 99999.csv': 'Rm 2 99999 mock file'
}
const documents = {
  [files['00001.csv']]: ['Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', 'Johns 1898 Assyrian Deeds and Documents ADD 1-3'],
  [files['Rm 2 99999.csv']]: ['Abcd 123', 'Abcd 456']
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
    'K.1': ['Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', 'Johns 1898 Assyrian Deeds and Documents ADD 1-3'],
    'Rm-II.99999': ['Abcd 123', 'Abcd 456']
  })
})

test('Loads correct files', () => {
  expect(fs.readFileSync.mock.calls).toEqual(_.keys(files).map(file => [`${directory}/${file}`]))
})
