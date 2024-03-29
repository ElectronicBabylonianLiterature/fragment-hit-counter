# fragment-hit-counter

[![Test Coverage](https://api.codeclimate.com/v1/badges/505e1372f12d2ec7eb0b/test_coverage)](https://codeclimate.com/github/ElectronicBabylonianLiterature/fragment-hit-counter/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/505e1372f12d2ec7eb0b/maintainability)](https://codeclimate.com/github/ElectronicBabylonianLiterature/fragment-hit-counter/maintainability)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

The script extracts fragments references from a catalogue. For each fragment in the catalogue the documents not starting with `BC` are collected and saved to the database under `uncuratedReferences` property as a list of objects with "File name" column without extension and quotes as `document` and the list of pages from the "Page" as integers as `pages`.

## Requirements

- Node
- Lodash

## Usage

To run the script, use the following command:

```
node index.js <path to folder> [-o <output file>] [-local] [-no-ssl] [--uri <MongoDB URI>] [--database <MongoDB database>]
```

The script takes the following arguments:

- `<path to folder>` - the path to the folder containing the hits data
- - `-o <output file>` (optional) - saves the output JSON to a file instead of updating the MongoDB database
- `-local` (optional) - saves the output JSON to a file and skips updating the MongoDB database
- `-no-ssl` (optional) - connects to the MongoDB server without SSL
- `--uri <MongoDB URI>` (optional) - the MongoDB connection string
- `--database <MongoDB database>` (optional) - the name of the MongoDB database

If `-local` is specified, the script will save the output JSON to a file with a default filename "`data.json`". If `-o` is specified, the script will save the output JSON to the file specified in the argument.

## Format

The catalogue directory should contain windows1252 encoded text files with the following format:

```
"Search Results"

"Summary"
"Saved on";"04.08.2018 17:45:55"
"Searched for";"K 6447"
"In index(es)";"X:\xxx\_OA\Indice\Index.pdx"
"Number of document(s) found";"5"              
"Number of instance(s) found";"5"              

"File name","Title","Page","Search Instance"
"Fincke 2000 Augenleiden nach keilschriftlichen Quellen. Untersuchungen zur altorientalischen Medizin WMF 70.pdf","","185","5 ......�........�.....�..... 178 K. 6447+7086+ ... cf. K. 2354+ ... K. 6461 Z. "

"File name","Title","Page","Search Instance"
"Hee�el 2016 Medizinische Texte aus dem Alten Mesopotamien Translating Writings of Early Scholars.pdf","","14","K. 3237 + K. 6447 + K. 7086 + K. 8356 + K. 8800 "

"File name","Title","Page","Search Instance"
"Borger HKL 1 [1967].pdf","","282","Ebeling KMI 45f.)+K 6447 C~,u~l.)+K 9828+K 11868(AMT 6/"

"File name","Title","Page","Search Instance"
"Borger HKL 2 [1975].pdf","","162","38) auch + K 6447 (von Thompson verwertet) + ~m 637 ("

"File name","Title","Page","Search Instance"
"BC 2.pdf","","392","sick people. [K. 6447] Portion out of the middle, 32in. by 31in., . "

```

The fragment ID is parsed from the file name:
- `<number>.csv` => `K.<number without leading zeroes>`
- `Sm <number>.csv` => `Sm.<number without leading zeroes>`
- `DT <number>.csv` => `DT.<number without leading zeroes>`
- `Rm <number>.csv` => `Rm.<number without leading zeroes>`
- `Rm 2 <number>.csv` => `Rm-II.<number without leading zeroes>`
- `Rm II <number>.csv` => `Rm-II.<number without leading zeroes>`
- `BM <number>.csv` => `BM.<number without leading zeroes>`
- `AA-BB-CC 0DD.csv.csv` => `18AA,<BB padded to to digits><CC padded to two digits>.<DD without leading zeroes>`
- `AA-BB-CC,DD.csv` => `18AA,<BB padded to to digits><CC padded to two digits>.<DD without leading zeroes>`
- `CBS <id>.csv` => `CBS.<id>`
- `N <id>.csv` => `N.<id>`
- `UM <id>.csv` => `UM.<id>`
- `Ni <id>.csv` => `Ni.<id>`
- `Si <id>.csv` => `Si.<id>`
- `HS <id>.csv` => `HS.<id>`
- `VAT <id>.csv` => `VAT.<id>`
- `ANT <id>.csv` => `ANT.<id>`
- `AOS-1 <id>.csv` => `AOS-1.<id>`
- `DavidAstr <id>.csv` => `DavidAstr.<id>`
- `EAH <id>.csv` => `EAH.<id>`
- `GCBC <id>.csv` => `GCBC.<id>`
- `Lager <id>.csv` => `Lager.<id>`
- `MLC <id>.csv` => `MLC.<id>`
- `NCBS <id>.csv` => `NCBS.<id>`
- `NCBT <id>.csv` => `NCBT.<id>`
- `Newell <id>.csv` => `Newell.<id>`
- `Ott-Seal <id>.csv` => `Ott-Seal.<id>`
- `Ott-Tablet <id>.csv` => `Ott-Tablet.<id>`
- `RBC <id>.csv` => `RBC.<id>`
- `YBC <id>.csv` => `YBC.<id>`

References from different files resulting in same fragment ID are combined for the final result.

If the file name does not match any pattern the file is ignored.

## Insert to MongoDB

If saved locally, the JSON file can be imported into the database with the following command (change as needed):

```
function doit() {
  references = [
    // ...
  ]
  missing = [];
  references.forEach(({_id, uncuratedReferences}) => {
    if (db.getCollection('fragments').findOne({_id: _id})) {
      db.getCollection('fragments').update(
        {_id: _id},
        {
          $set: {
            uncuratedReferences
          }
        }
      );
    } else {
      missing.push({_id, uncuratedReferences});
    }
  });
  return missing;
}

doit();
```
