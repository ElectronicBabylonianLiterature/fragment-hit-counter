const mapNames = require('./mapNames')

test.each`
  fileName              | fragmentId
  ${'00001.csv'}        | ${'K.1'}
  ${'22303.csv'}        | ${'K.22303'} 
  ${'Sm 00090.csv'}     | ${'Sm.90'} 
  ${'DT 40000.csv'}     | ${'DT.40000'} 
  ${'Rm 00201.csv'}     | ${'Rm.201'} 
  ${'Rm 2 700.csv'}     | ${'Rm-II.700'}
  ${'Rm II 001.csv'}    | ${'Rm-II.1'}
  ${'BM 12345.csv'}     | ${null}
  ${'BM 123456.csv'}    | ${null}
  ${'invalid.xlsx'}     | ${null}
`('returns $fragmentId for $fileName', ({ fileName, fragmentId }) => {
  expect(mapNames(fileName)).toBe(fragmentId)
})
