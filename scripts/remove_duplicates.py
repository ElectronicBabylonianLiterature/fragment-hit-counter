import json
import re
from collections import defaultdict

def extract_name_year(document):
    match = re.match(r"(.*[\s_]\d{4})", document)
    return match.group(1) if match else None

def remove_duplicates(data):
    removed_duplicates = []
    for entry in data:
        if "uncuratedReferences" not in entry:
            continue

        references = entry["uncuratedReferences"]
        ref_dict = defaultdict(list)

        for ref in references:
            name_year = extract_name_year(ref["document"])
            if name_year:
                ref_dict[name_year].append(ref)

        unique_references = []
        for name_year, refs in ref_dict.items():
            if len(refs) > 1:
                detailed_ref = max(refs, key=lambda r: len(r["pages"]))
                for r in refs:
                    if r != detailed_ref:
                        removed_duplicates.append((r, detailed_ref))
                unique_references.append(detailed_ref)
            else:
                unique_references.extend(refs)

        # Include any references that don't match the name_year pattern
        non_matching_refs = [ref for ref in references if not extract_name_year(ref["document"])]
        unique_references.extend(non_matching_refs)
        
        entry["uncuratedReferences"] = unique_references

    return data, removed_duplicates

# Load your JSON data with UTF-8 encoding
file_path = r'C:\Users\LokalAdmin\Documents\Assyriology\eBL\Uncurated references\IM.json'
with open(file_path, 'r', encoding='utf-8') as file:
    data = json.load(file)

# Remove duplicates and get the removed duplicates
data, removed_duplicates = remove_duplicates(data)

# Save the cleaned data back to a JSON file with UTF-8 encoding
cleaned_file_path = r'C:\Users\LokalAdmin\Documents\Assyriology\eBL\Uncurated references\Cleaned_IM.json'
with open(cleaned_file_path, 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=2, ensure_ascii=False)

# Save removed duplicates to a TSV file
removed_file_path = r'C:\Users\LokalAdmin\Documents\Assyriology\eBL\Uncurated references\Removed_IM.tsv'
with open(removed_file_path, 'w', encoding='utf-8') as file:
    file.write("removed_document\tremoved_pages\tkept_document\tkept_pages\n")
    for removed, kept in removed_duplicates:
        removed_pages_str = ",".join(map(str, removed["pages"]))
        kept_pages_str = ",".join(map(str, kept["pages"]))
        file.write(f"{removed['document']}\t{removed_pages_str}\t{kept['document']}\t{kept_pages_str}\n")

print("Duplicates removed, cleaned data saved to 'Cleaned_IM.json', and removed duplicates saved to 'Removed_IM.tsv'")
