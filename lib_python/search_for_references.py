import os
import time
import pyautogui
import subprocess
from pathlib import Path
from pymongo import MongoClient

# Configuration - Update these paths to match your system
ACROBAT_PATH = r"C:\Program Files\Adobe\Acrobat DC\Acrobat\Acrobat.exe"
PDF_INDEX = r"G:\My Drive\_OA\Indice\Index.pdx"
INPUT_FILE = r"G:\My Drive\eBL\Catalogue\yale_missing_ids.txt"
DELAYS = {
    'initial': 2,
    'after_navigation': 7,
    'after_entry': 15,
    'after_final_click': 7
}

def log_step(action, details=""):
    print(f"[{time.strftime('%H:%M:%S')}] {action.ljust(40)} {details}")

def get_yale_fragment_ids():
    """Query MongoDB for Yale fragments without uncuratedReferences"""
    log_step("Connecting to MongoDB")
    client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
    db = client['ebl']
    
    log_step("Querying fragments", "YALE_PEABODY_COLLECTION without uncuratedReferences")
    cursor = db.fragments.find(
        {"museum": "YALE_PEABODY_COLLECTION", "uncuratedReferences": {"$exists": False}},
        {"_id": 1}
    )
    
    ids = [str(doc["_id"]).replace(".", " ") for doc in cursor]
    log_step(f"Found {len(ids)} fragments")
    return ids

def save_ids_to_file(ids, file_path):
    with open(file_path, 'w') as f:
        f.write('\n'.join(ids) + '\n')
    log_step("Saved IDs to file", file_path)

def process_entry(museumnumber):
    """EXACT replication of RoboTask sequence"""
    try:
        # 1. Launch Acrobat with Index.pdx (Action2)
        subprocess.Popen([ACROBAT_PATH, PDF_INDEX])
        time.sleep(DELAYS['initial'])

        # 2. Send LEFT+ENTER (Action4)
        pyautogui.press('left')
        pyautogui.press('enter')
        time.sleep(DELAYS['after_navigation'])

        # 3. Move mouse to (95,254) and click (Actions 6-7)
        pyautogui.moveTo(95, 254)
        pyautogui.click()
        
        # 4. Send Ctrl+A, museum number, comma, ENTER (Action8)
        pyautogui.hotkey('ctrl', 'a')
        pyautogui.typewrite(f"{museumnumber}")
        pyautogui.press('enter')
        time.sleep(DELAYS['after_entry'])

        # 5. Move mouse to (137,190) and click (Actions 10-11)
        pyautogui.moveTo(137, 190)
        pyautogui.click()
        
        # 6. Send 2x DOWN, ENTER (Action12)
        pyautogui.press('down', presses=2)
        pyautogui.press('enter')
        time.sleep(DELAYS['after_navigation'])

        # 7. Type museum number + ENTER (Action14)
        pyautogui.typewrite(museumnumber)
        pyautogui.press('enter')
        time.sleep(DELAYS['after_final_click'])

        # 8. Move mouse to (63,189) and click (Actions 16-17)
        pyautogui.moveTo(63, 189)
        pyautogui.click()

        return True
    except Exception as e:
        log_step("ERROR in processing", str(e))
        return False
    finally:
        # 9. Kill Acrobat (Action18)
        os.system("taskkill /f /im acrobat.exe")

def get_user_choice():
    """Ask user whether to use existing file or query MongoDB"""
    print("\n" + "="*60)
    print("YALE FRAGMENT PROCESSOR - ROBOTASK PRECISE REPLICA".center(60))
    print("="*60)
    
    while True:
        print("\nOptions:")
        print("1. Use existing text file (fast)")
        print("2. Generate new list from MongoDB (might take longer)")
        choice = input("Enter your choice (1 or 2): ").strip()
        
        if choice in ('1', '2'):
            return choice
        print("Invalid choice. Please enter 1 or 2.")

def main():
    # 1. Get user choice
    choice = get_user_choice()
    
    if choice == '1':
        # Use existing file
        if not os.path.exists(INPUT_FILE):
            log_step("Error", f"Input file not found at {INPUT_FILE}")
            return
            
        with open(INPUT_FILE, 'r') as f:
            museum_ids = [line.strip() for line in f if line.strip()]
            log_step(f"Loaded {len(museum_ids)} IDs from existing file")
    else:
        # Query MongoDB and save to file
        fragment_ids = get_yale_fragment_ids()
        if not fragment_ids:
            log_step("No fragments found matching criteria")
            return
        save_ids_to_file(fragment_ids, INPUT_FILE)
        museum_ids = fragment_ids

    # 2. Process each entry
    processed_ids = []
    for i, museumnumber in enumerate(museum_ids, 1):
        log_step(f"Processing {i}/{len(museum_ids)}", museumnumber)
        if process_entry(museumnumber):
            processed_ids.append(museumnumber)
            update_input_file(INPUT_FILE, processed_ids)

    log_step("Completed", f"Processed {len(processed_ids)}/{len(museum_ids)} entries")

def update_input_file(file_path, processed_ids):
    """Remove processed IDs from input file"""
    with open(file_path, 'r') as f:
        all_ids = [line.strip() for line in f if line.strip()]
    
    remaining_ids = [id for id in all_ids if id not in processed_ids]
    
    with open(file_path, 'w') as f:
        f.write('\n'.join(remaining_ids) + '\n')
    
    log_step("Updated input file", f"Removed {len(processed_ids)} IDs")

if __name__ == "__main__":
    # PyAutoGUI safety settings
    pyautogui.FAILSAFE = True
    pyautogui.PAUSE = 0.5
    
    try:
        main()
    except KeyboardInterrupt:
        log_step("Script interrupted by user")
    finally:
        print("\n" + "="*60)
        print("PROCESS COMPLETED".center(60))
        print("="*60)