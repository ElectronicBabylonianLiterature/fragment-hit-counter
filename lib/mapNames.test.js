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
  ${'CBS 587bis.csv'}   | ${'CBS.587bis'}
  ${'N 708A.csv'}       | ${'N.708A'}
  ${'UM 29-16-055.csv'} | ${'UM.29-16-055'}
  ${'Ni 877.csv'} | ${'Ni.877'}
  ${'Ni 999.csv'} | ${'Si.999'}
  ${'HS 1234.csv'} | ${'HS.1234'}
  ${'VAT 134.csv'} | ${'VAT.134'}
  ${'ANT 134.csv'} | ${'ANT.134'}
  ${'AOS-1 134.csv'} | ${'AOS-1.134'}
  ${'DavidAstr 134.csv'} | ${'DavidAstr.134'}
  ${'EAH 134.csv'} | ${'EAH.134'}
  ${'GCBC 134.csv'} | ${'GCBC.134'}
  ${'Lager 134.csv'} | ${'Lager.134'}
  ${'MLC 134.csv'} | ${'MLC.134'}
  ${'NCBS 134.csv'} | ${'NCBS.134'}
  ${'NCBT 134.csv'} | ${'NCBT.134'}
  ${'Newell 134.csv'} | ${'Newell.134'}
  ${'Ott-Seal 134.csv'} | ${'Ott-Seal.134'}
  ${'Ott-Tablet 134.csv'} | ${'Ott-Tablet.134'}
  ${'RBC 134.csv'} | ${'RBC.134'}
  ${'YBC 134.csv'} | ${'YBC.134'}  
  ${'invalid.xlsx'}     | ${null}
`('returns $fragmentId for $fileName', ({ fileName, fragmentId }) => {
  expect(mapNames(fileName)).toBe(fragmentId)
})
