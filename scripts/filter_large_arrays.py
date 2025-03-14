import json

# File paths
input_file = r"C:\\Users\\LokalAdmin\\Documents\\Assyriology\\eBL\\Uncurated references\\Cleaned_IM.json"
output_file_49 = r"C:\\Users\\LokalAdmin\\Documents\\Assyriology\\eBL\\Uncurated references\\Cleaned_IM_49.json"
output_file_50_plus = r"C:\\Users\\LokalAdmin\\Documents\\Assyriology\\eBL\\Uncurated references\\Cleaned_IM_50+.json"

# Load the input JSON file
with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Separate entries
kept_entries = []
removed_entries = []

for entry in data:
    if len(entry.get("uncuratedReferences", [])) >= 50:
        removed_entries.append(entry)
    else:
        kept_entries.append(entry)

# Save the filtered entries to the respective output files
with open(output_file_49, 'w', encoding='utf-8') as f:
    json.dump(kept_entries, f, ensure_ascii=False, indent=4)

with open(output_file_50_plus, 'w', encoding='utf-8') as f:
    json.dump(removed_entries, f, ensure_ascii=False, indent=4)

print(f"Entries with fewer than 50 references saved to: {output_file_49}")
print(f"Entries with 50 or more references saved to: {output_file_50_plus}")
