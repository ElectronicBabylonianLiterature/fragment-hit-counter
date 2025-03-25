import os
import json
import re
from pymongo import MongoClient

STOPWORDS = ["Postdoc", "habilpart2", "Ausf.Katw2",
             "Pedersén 2005"]  # Add more stopwords as needed
# Matches documents that contain only numbers
PATTERN = re.compile(r'^[\d_]+$')

# Connect to MongoDB
mongodb_uri = os.getenv('MONGODB_URI', '')
client = MongoClient(mongodb_uri)
db = client['ebl']
fragments = db['fragments']


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


def update_database(data):
    for entry in data:
        excavation_number = entry["excavationNumber"]
        full_number = f"{excavation_number['prefix']}{excavation_number['number']}{excavation_number['suffix']}"

        query = {"archaeology.excavationNumber": excavation_number}

        if "_id" in entry:
            query["_id"] = entry["_id"]

        if entry["uncuratedReferences"]:
            fragments.update_one(
                query,
                {"$addToSet": {"uncuratedReferences": {
                    "$each": entry["uncuratedReferences"]}}}
            )


def main():
    json_data = load_json('./BabExc_cleaned.json')  # Adjust filename as needed
    filtered_data = filter_references(json_data)
    update_database(filtered_data)


if __name__ == "__main__":
    main()
