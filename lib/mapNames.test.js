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
  ${'48-10-31 001.csv'} | ${'1848,1031.1'}
  ${'63-2-9 123.csv'}   | ${'1863,0209.123'}
  ${'48-10-31,1.csv'}   | ${'1848,1031.1'}
  ${'63-2-9,123.csv'}   | ${'1863,0209.123'}
  ${'BM 12345.csv'}     | ${'BM.12345'}
  ${'BM 123456.csv'}    | ${'BM.123456'}
  ${'CBS 123456.csv'}   | ${'CBS.123456'}
  ${'N 123456.csv'}     | ${'N.123456'}
  ${'UM 123456.csv'}    | ${'UM.123456'}
  ${'invalid.xlsx'}     | ${null}
`('returns $fragmentId for $fileName', ({ fileName, fragmentId }) => {
  expect(mapNames(fileName)).toBe(fragmentId)
})
