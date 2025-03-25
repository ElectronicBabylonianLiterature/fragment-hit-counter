import os
import json
import re
from pymongo import MongoClient

STOPWORDS = ["Postdoc", "habilpart2", "Ausf.Katw2", "Pedersén 2005"]
PATTERN = re.compile(r'^[\d_]+$')  # Matches documents that contain only numbers

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
                and not PATTERN.match(ref["document"])  # Exclude if it matches the pattern
            ]
    return data

def update_database(data):
    total = len(data)
    if total == 0:
        print("No data to process.")
        return

    print(f"Processing {total} entries...")
    for i, entry in enumerate(data, start=1):
        excavation_number = entry.get("excavationNumber")
        
        if not excavation_number or any(v is None for v in excavation_number.values()):
            print(f"Skipping entry {i}/{total}: Missing excavation number.")
            continue  # Skip this record
        
        full_number = f"{excavation_number['prefix']}{excavation_number['number']}{excavation_number['suffix']}"
        query = {"archaeology.excavationNumber": excavation_number}

        if "_id" in entry:
            query["_id"] = entry["_id"]

        if entry["uncuratedReferences"]:
            fragments.update_one(
                query,
                {"$addToSet": {"uncuratedReferences": {"$each": entry["uncuratedReferences"]}}}
            )

        # Print progress every 10%
        if i % (total // 5) == 0 or i == total:
            print(f"Progress: {i}/{total} ({(i / total) * 100:.0f}%)")

    print("Database update completed.")

def main():
    json_data = load_json('./BabExc_cleaned.json')  # Adjust filename as needed
    filtered_data = filter_references(json_data)
    update_database(filtered_data)

if __name__ == "__main__":
    main()
