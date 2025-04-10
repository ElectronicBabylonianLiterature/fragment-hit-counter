"""
EBL Fragment Reference Updater

This script updates uncurated references in the EBL MongoDB fragments collection, with flexible matching options.

Functionality:
1. Loads JSON data containing fragment references to be added
2. Filters out unwanted references based on stopwords and numeric patterns
3. Updates MongoDB documents using either:
   - Default: matches by '_id' (tries original ID and space-replaced version)
   - Optional: matches by complete 'excavationNumber' (prefix+number+suffix)
4. Provides detailed progress reporting and error handling

Key Features:
- Configurable matching criterion (_id or excavationNumber)
- Automatic fallback to period-replaced IDs when spaces are present
- Skip logic for incomplete/missing data
- Progress tracking with percentage completion

Usage:
  python script.py [--match {_id|excavationNumber}]

Parameters:
  --match  Specify matching field (_id or excavationNumber, default: _id)

Input:
  Requires ybc_missing.json (or specified JSON file) with fragment data

Output:
  Updates MongoDB collection with new references
  Prints progress and any warnings to console

Environment:
  Requires MONGODB_URI environment variable for database connection
"""

import os
import json
import re
from pymongo import MongoClient

STOPWORDS = ["Postdoc", "habilpart2", "Ausf.Katw2",
             "Saenz_Masterarbeit_Manuskript_Entwurf", "Fechner 7 sages - Manuskript",
             "Koch forthcoming Mesopotamian Divination Texts- Conversing with the Gods GMTR",
             "04_EJ_BDP", "The Babylonian Disputation Poems] The Babylonian Disputation Poems"]
# Matches documents that contain only numbers
PATTERN = re.compile(r'^[\d\(\)_]+$')

# Connect to MongoDB
print("Connecting to MongoDB...")
mongodb_uri = os.getenv('MONGODB_URI', '')
client = MongoClient(mongodb_uri)
db = client['ebl']
fragments = db['fragments']
print("Connected to MongoDB.")


def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        return json.load(file)


def filter_references(data):
    for entry in data:
        if "uncuratedReferences" in entry:
            entry["uncuratedReferences"] = [
                ref for ref in entry["uncuratedReferences"]
                if not any(stopword in ref["document"] for stopword in STOPWORDS)
                # Exclude if it matches the pattern
                and not PATTERN.match(ref["document"])
            ]
    return data


def update_database(data, match_criterion='_id'):
    total = len(data)
    if total == 0:
        print("No data to process.")
        return

    print(f"Processing {total} entries using {match_criterion} as matching criterion...")
    
    for i, entry in enumerate(data, start=1):
        if match_criterion == 'excavationNumber':
            excavation_number = entry.get("excavationNumber")
            
            if not excavation_number or any(v is None for v in excavation_number.values()):
                print(f"Skipping entry {i}/{total}: Missing or incomplete excavation number.")
                continue
                
            full_number = f"{excavation_number['prefix']}{excavation_number['number']}{excavation_number['suffix']}"
            query = {"archaeology.excavationNumber": excavation_number}
            update_result = fragments.update_one(
                query,
                {"$addToSet": {"uncuratedReferences": {
                    "$each": entry["uncuratedReferences"]}}}
            ) if entry.get("uncuratedReferences") else None
            
        else:  # default is _id
            if "_id" not in entry:
                print(f"Skipping entry {i}/{total}: Missing _id.")
                continue
            
            original_id = entry["_id"]
            queries = [{"_id": original_id}]
            
            # Add alternative query with spaces replaced by periods
            if ' ' in original_id:
                modified_id = original_id.replace(' ', '.')
                queries.append({"_id": modified_id})
            
            updated = False
            for query in queries:
                if entry.get("uncuratedReferences"):
                    update_result = fragments.update_one(
                        query,
                        {"$addToSet": {"uncuratedReferences": {
                            "$each": entry["uncuratedReferences"]}}}
                    )
                    if update_result.modified_count > 0:
                        updated = True
                        print(f"Updated document with _id: {query['_id']}")
                        break
            
            if not updated and entry.get("uncuratedReferences"):
                print(f"Warning: No matching document found for _id: {original_id} (tried both original and space-replaced versions)")

        # Print progress every 10%
        if i % (total // 5) == 0 or i == total:
            print(f"Progress: {i}/{total} ({(i / total) * 100:.0f}%)")

    print("Database update completed.")


def main():
    import argparse
    parser = argparse.ArgumentParser(description='Update fragment references in MongoDB.')
    parser.add_argument('--match', choices=['_id', 'excavationNumber'], default='_id',
                       help='Field to use for matching documents (default: _id)')
    args = parser.parse_args()
    
    json_data = load_json('./missing-ybc.json')  # Adjust filename as needed
    filtered_data = filter_references(json_data)
    update_database(filtered_data, args.match)


if __name__ == "__main__":
    main()