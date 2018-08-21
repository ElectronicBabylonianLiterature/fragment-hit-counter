const countHits = require('./countHits')

const catalog = `Search Results\t\t\t\t\t\t
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
401239.pdf;"";"218";"or nearby (48-7-20\t 115-120; 48-11-4\t281-83: Reade 1992). "\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
RlA 09 Nab - Nuzi 1998-2000.pdf;"";"218";"or nearby (48-7-20\t 115-120; 48-11-4\t281-83: Reade 1992). "\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
0(6).pdf;"";"17";"\t [412] 48-7-20\t115\t obv. 18\t21; amel bi-'-la-a-nu\t "\t
0(6).pdf;"";"19";"tarn\t [412] 48-7-20\t115\t obv. 15\t [437] K. 168\t obv. "\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
0(7).pdf;"";"7";"14\t [412] 48-7-20\t115\t obv. 12\t [464] K. 1519\t obv. "\t
0(7).pdf;"";"7";"21\t [412] 48-7-20\t115\t rv. 3\t11\t14\t [418] Sm. "
0(7).pdf;"";"7";"21\t [412] 48-7-20\t115\t rv. 14\t [571] K. 998\t obv. "\t
0(7).pdf;"";"10";"4\t [412] 48-7-20\t115\t obv. 15\t [460] K. 1250\t obv. "\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
ABL 4-6.pdf;"";"97";"433 [412.] 48-7-20\t 115. OBVERSE. T; ^ft H ' T "\t\t\t\t\t
ABL 4-6.pdf;"";"98";"434 [412.] 48-7-20\t 115 (continued). REVERSE. raTA T T e "\t\t\t\t\t
ABL 4-6.pdf;"";"127";"Rm. 2\t 5 48-7-20\t 115 Bu. 91-5-9\t 12 Rm. 77 "\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
BC Abcd 123.pdf;"";"330";"p. 372. [48-7-20\t 115] Upper half\t 2 in. by 1 in.; "\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
BC 5.pdf;"";"194";"(p. 219). 48-7-20\t 115 (p. 1688). 67-4-2\t 1 "\t\t\t\t
BC 5.pdf;"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
Johns 1898 Assyrian Deeds and Documents ADD 1-3.pdf;"";"1755";"1066\t 4748 ; 48-7-20\t 115; 67-4-2\t i; 82-5-22\t "`

test('returns number of documents not starting with "BC"', () => {
  expect(countHits(catalog)).toEqual(7)
})