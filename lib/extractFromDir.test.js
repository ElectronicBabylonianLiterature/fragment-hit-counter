jest.mock('./extractDocuments')
const fs = require('fs')
const _ = require('lodash')
const windows1252 = require('windows-1252')
const extractFromDir = require('./extractFromDir')
const extractDocuments = require('./extractDocuments')
const Reference = require('./Reference')

const files = {
  '00001.csv': 'K.1 möck file',
  'Rm 2 99999.csv': 'Rm 2 99999 mock’ file',
  'Rm II 99999.csv': 'Rm II 99999 mock file'
}
const references = {
  [files['00001.csv']]: [
    new Reference('Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', [2]),
    new Reference('Johns 1898 Assyrian Deeds and Documents ADD 1-3', [4])
  ],
  [files['Rm 2 99999.csv']]: [
    new Reference('Abcd 123', [1]),
    new Reference('Abcd 456', [3])
  ],
  [files['Rm II 99999.csv']]: [
    new Reference('Abcd 123', [1, 2]),
    new Reference('Abcd 999', [4])
  ]
}
const directory = './directory'

let result

beforeEach(() => {
  jest.spyOn(fs, 'readdirSync').mockReturnValue(_.keys(files).concat('invalid.xlsx'))
  jest.spyOn(fs, 'readFileSync').mockImplementation(fileName => windows1252.encode(files[fileName.slice(directory.length + 1)]))
  extractDocuments.mockImplementation(catalog => references[catalog])
  result = extractFromDir(directory)
})

test('Counts hits from all the files in the folder', () => {
  expect(result).toEqual({
    'K.1': [
      new Reference('Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', [2]),
      new Reference('Johns 1898 Assyrian Deeds and Documents ADD 1-3', [4])
    ],
    'Rm-II.99999': [
      new Reference('Abcd 123', [1, 2]),
      new Reference('Abcd 456', [3]),
      new Reference('Abcd 999', [4])
    ]
  })
})

test('Loads correct files', () => {
  expect(fs.readFileSync.mock.calls).toEqual(_.keys(files).map(file => [`${directory}/${file}`, { encoding: 'latin1' }]))
})
