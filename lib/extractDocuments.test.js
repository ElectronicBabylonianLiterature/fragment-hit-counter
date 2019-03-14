const extractDocuments = require('./extractDocuments')
const Reference = require('./Reference')

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
"Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50.pdf";"";"";"Ashurbanipal (54): 48-7-20\t 115; 80-7-19\t 35; 40; 46; 82-"\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
"0(7).pdf";"";"7";"14\t [412] 48-7-20\t115\t obv. 12\t [464] K. 1519\t obv. "\t
"0(7).pdf";"";"7";"21\t [412] 48-7-20\t115\t rv. 3\t11\t14\t [418] Sm. "
"0(7).pdf";"";"";"21\t [412] 48-7-20\t115\t rv. 14\t [571] K. 998\t obv. "\t
"0(7).pdf";"";"10";"4\t [412] 48-7-20\t115\t obv. 15\t [460] K. 1250\t obv. "\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
"ABL 4-6.pdf";"";"97";"433 [412.] 48-7-20\t 115. OBVERSE. T; ^ft H ' T "\t\t\t\t\t
"ABL 4-6.pdf";"";"98";"434 [412.] 48-7-20\t 115 (continued). REVERSE. raTA T T e "\t\t\t\t\t
"ABL 4-6.pdf";"";"127";"Rm. 2\t 5 48-7-20\t 115 Bu. 91-5-9\t 12 Rm. 77 "\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
"BC Abcd 123.pdf";"";"330";"p. 372. [48-7-20\t 115] Upper half\t 2 in. by 1 in.; "\t\t\t\t
\t\t\t\t\t\t
File name;"Title";"Page";"Search Instance"\t\t\t\t\t\t
"BC 5.pdf";"";"194";"(p. 219). 48-7-20\t 115 (p. 1688). 67-4-2\t 1 "\t\t\t\t
"BC 5.pdf";"";"208";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
"CAD 5.pdf";"";"not a number";"to the king. 48-7-20\t 115 (p. 1688). Letter to the - "\t\t\t\t\t
"Abraham, Szuszan in the Egibi Texts (Susan), OLP 28 1997.pdf";"0548;OLP28; 04Abraham";"3";""
"Biggs 1992 Rv Durand ARM 26 1; Charpin et al ARM 26 2 JNES 51.pdf";"<product> <source> <xref ref-type=""transliteration"" rid=""trans12"" ptype=""t545838"" citart=""citart1"">Archives <html_ent glyph=""@#233;"" ascii=""e""></html_ent>pistolaires de Mari</xref> </source> <contrib contrib-type=""author""> <name> <given-names>Jean-Marie</given-names> <surname>Durand</surname> </name> </contrib> </product><product> <source> <xref ref-type=""transliteration"" rid=""trans13"" ptype=""t545838"" citart=""citart1"">Archives <html_ent glyph=""@#233;"" ascii=""e""></html_ent>pistolaires de Mari</xref> </source> <contrib contrib-type=""author""> <name> <given-names>Dominique</given-names> <surname>Charpin</surname> </name> </contrib> <contrib contrib-type=""author""> <name> <given-names>Francis</given-names> <surname>Jonnes</surname> </name> </contrib> <contrib contrib-type=""author""> <name> <given-names>Sylvie</given-names> <surname>Lackenbacher</surname> </name> </contrib> <contrib contrib-type=""author""> <name> <given-names>Bertrand</given-names> <surname>Lafont</surname> </name> </contrib> </product>";"3";"p. 51, n. 243, Durand refers to YOS 10 36. The text concerns the "
`

test('Returns documents not starting with "BC" or "CAD"', () => {
  expect(extractDocuments(catalog)).toEqual([
    new Reference('Fincke 2003-2004 The Babylonian Texts of Nineveh AfO 50', []),
    new Reference('0(7)', [7, 10]),
    new Reference('ABL 4-6', [97, 98, 127]),
    new Reference('CAD 5', []),
    new Reference('Abraham, Szuszan in the Egibi Texts (Susan), OLP 28 1997', [3]),
    new Reference('Biggs 1992 Rv Durand ARM 26 1; Charpin et al ARM 26 2 JNES 51', [3])
  ])
})
