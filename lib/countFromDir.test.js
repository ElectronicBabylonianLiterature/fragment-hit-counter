const fs = require('fs')
const _ = require('lodash')
const countFromDir = require('./countFromDir')

const files = {
  '00001.csv': `Search Results\t\t\t\t\t\t
\t\t\t\t\t\t
Summary\t\t\t\t\t\t
Saved on;"16.08.2018 10:18:58"\t\t\t\t\t\t
Searched for;"48-7-20 115"\t\t\t\t\t\t
In index(es);"X:\\yyy\\yyy\\_OA\\Indice\\Index.pdx"\t\t\t\t\t\t
Number of document(s) found;"9"              \t\t\t\t\t\t
Number of instance(s) found;"16"             \t\t\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50.pdf;"";"38";"Ashurbanipal (54): 48-7-20\t 115; 80-7-19\t 35; 40; 46; 82-"\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
Johns 1898 Assyrian Deeds and Documents ADD 1-3.pdf;"";"1755";"1066\t 4748 ; 48-7-20\t 115; 67-4-2\t i; 82-5-22\t "`,

  'Rm 2 99999.csv': `Search Results\t\t\t\t\t\t
\t\t\t\t\t\t
Summary\t\t\t\t\t\t
Saved on;"16.08.2018 10:18:58"\t\t\t\t\t\t
Searched for;"48-7-20 115"\t\t\t\t\t\t
In index(es);"X:\\yyy\\yyy\\_OA\\Indice\\Index.pdx"\t\t\t\t\t\t
Number of document(s) found;"9"              \t\t\t\t\t\t
Number of instance(s) found;"16"             \t\t\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
BC Abcd 123.pdf;"";"330";"p. 372. [48-7-20\t 115] Upper half\t 2 in. by 1 in.; "\t\t\t\t"`
}

const directory = './directory'

beforeEach(() => {
  jest.spyOn(fs, 'readdirSync').mockReturnValue(_.keys(files).concat('invalid.xlsx'))
  jest.spyOn(fs, 'readFileSync').mockImplementation(fileName => files[fileName.slice(directory.length + 1)])
})

test('Counts hits from all the files in the folder', () => {
  expect(countFromDir(directory)).toEqual({
    'K.1': 2,
    'Rm-II.99999': 0
  })
})

test('Loads correct files', () => {
  countFromDir(directory)
  expect(fs.readFileSync.mock.calls).toEqual(_.keys(files).map(file => [`${directory}/${file}`]))
})
