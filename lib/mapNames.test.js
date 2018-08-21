const mapNames = require('./mapNames')

test.each`
  fileName              | fragmentId
  ${'00001.csv'}        | ${'K.1'}
  ${'22303.csv'}        | ${'K.22303'} 
  ${'SM 00090.csv'}     | ${'SM.90'} 
  ${'DT 40000.csv'}     | ${'DT.40000'} 
  ${'Rm 00201.csv'}     | ${'Rm.201'} 
  ${'Rm 2 00700.csv'}   | ${'Rm-II.700'}
  ${'Rm II 10001.csv'}  | ${'Rm-II.10001'} 
`('returns $fragmentId for $fileName', ({fileName, fragmentId}) => {
  expect(mapNames(fileName)).toBe(fragmentId)
})
