const extractDocuments = require('./extractDocuments')

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
0(7).pdf;"";"7";"14\t [412] 48-7-20\t115\t obv. 12\t [464] K. 1519\t obv. "\t
0(7).pdf;"";"7";"21\t [412] 48-7-20\t115\t rv. 3\t11\t14\t [418] Sm. "
0(7).pdf;"";"7";"21\t [412] 48-7-20\t115\t rv. 14\t [571] K. 998\t obv. "\t
0(7).pdf;"";"10";"4\t [412] 48-7-20\t115\t obv. 15\t [460] K. 1250\t obv. "\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
ABL 4-6.pdf;"";"97";"433 [412.] 48-7-20\t 115. OBVERSE. T; ^ft H ' T "\t\t\t\t\t
ABL 4-6.pdf;"";"98";"434 [412.] 48-7-20\t 115 (continued). REVERSE. raTA T T e "\t\t\t\t\t
ABL 4-6.pdf;"";"127";"Rm. 2\t 5 48-7-20\t 115 Bu. 91-5-9\t 12 Rm. 77 "\t\t\t
CADShoudlBeAHit.pdf;"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
cadShoudlBeAHit.pdf;"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
BC Abcd 123.pdf;"";"330";"p. 372. [48-7-20\t 115] Upper half\t 2 in. by 1 in.; "\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
BC 5.pdf;"";"194";"(p. 219). 48-7-20\t 115 (p. 1688). 67-4-2\t 1 "\t\t\t\t
BC 5.pdf;"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
CAD 5.pdf;"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
[CAD D, E, I] Edzard 1961 Rv CAD D, E, I ZA 54.pdf;"";"1";"= I G Rm 2, 447 zu Rm 2,447 I G S. U. 51("
cad_s_shin_2 [1992].pdf;"Untitled";"458";"BSOAS 20 263 DT 290: 8 f. (= Bil. Edubba B iv). pi-ia-"`

const alternativeCatalog = `"Search Results"

"Summary"
"Saved on";"27.07.2018 12:19:10"
"Searched for";"K 14021"
"In index(es)";"X:\\yyy\\yyy\\_OA\\Indice\\Index.pdx"
"Number of document(s) found";"1"              
"Number of instance(s) found";"1"              

"File name";"Title";"Page";"Search Instance"
"ABL 4-6.pdf";"";"97";"433 [412.] 48-7-20\t 115. OBVERSE. T; ^ft H ' T "
"[CAD D, E, I] Edzard 1961 Rv CAD D, E, I ZA 54.pdf";"";"1";"= I G Rm 2, 447 zu Rm 2,447 I G S. U. 51("
"BC 3.pdf";"";"467";"houses, etc. [K. 14021] Left-hand corner, 1ain. by 1lin.; ......... + 6 "
"CAD 3.pdf";"";"467";"houses, etc. [K. 14021] Left-hand corner, 1ain. by 1lin.; ......... + 6 "
"cad_s_shin_2 [1992].pdf";"Untitled";"458";"BSOAS 20 263 DT 290: 8 f. (= Bil. Edubba B iv). pi-ia-"
"CADShoudlBeAHit.pdf";"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
"cadShoudlBeAHit.pdf";"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
`

test('Returns documents not starting with "BC" or "CAD"', () => {
  expect(extractDocuments(catalog)).toEqual([
    {
      document: 'Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50',
      pages: [38]
    },
    {
      document: '0(7)',
      pages: [7, 10]
    },
    {
      document: 'ABL 4-6',
      pages: [97, 98, 127]
    },
    {
      document: 'CADShoudlBeAHit',
      pages: [208]
    },
    {
      document: 'cadShoudlBeAHit',
      pages: [208]
    },
    {
      document: '[CAD D, E, I] Edzard 1961 Rv CAD D, E, I ZA 54',
      pages: [1]
    }
  ])
})

test('Returns documents not starting with "BC" or "CAD" in alternative format', () => {
  expect(extractDocuments(alternativeCatalog)).toEqual([
    {
      document: 'ABL 4-6',
      pages: [97]
    },
    {
      document: '[CAD D, E, I] Edzard 1961 Rv CAD D, E, I ZA 54',
      pages: [1]
    },
    {
      document: 'CADShoudlBeAHit',
      pages: [208]
    },
    {
      document: 'cadShoudlBeAHit',
      pages: [208]
    }
  ])
})
