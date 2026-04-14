import os
import pandas as pd
import requests
from datetime import datetime

# URL of a sample Kaggle dataset (we download a public CSV if possible, or just mock it)
# Since we don't have kaggle API configured, we simulate a sync by reading the current CSV 
# backing it up, cleaning it and timestamping the last update.

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_NAME = "bengaluru.csv"
FILE_PATH = os.path.join(DATA_DIR, FILE_NAME)
BACKUP_DIR = os.path.join(DATA_DIR, "backups")

def sync_data():
    print("Starting automated dataset sync...")
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        
    date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # 1. Backup old data
    if os.path.exists(FILE_PATH):
        backup_path = os.path.join(BACKUP_DIR, f"bengaluru_backup_{date_str}.csv")
        df = pd.read_csv(FILE_PATH)
        df.to_csv(backup_path, index=False)
        print(f"Backed up current dataset to: {backup_path}")
        
    # 2. Simulate API Fetch / Sync
    # For a real implementation:
    # os.system('kaggle datasets download -d amitabhajoy/bengaluru-house-price-data --unzip')
    print("Fetching new data chunks (Simulated via pandas merge check)...")
    
    df_new = pd.read_csv(FILE_PATH)
    
    # 3. Clean and Validate
    original_len = len(df_new)
    df_new.drop_duplicates(inplace=True)
    df_new.dropna(subset=['location', 'total_sqft', 'price'], inplace=True)
    
    cleaned_len = len(df_new)
    print(f"Removed {original_len - cleaned_len} invalid or duplicate records.")
    
    # 4. Save synced version
    df_new.to_csv(FILE_PATH, index=False)
    
    # Save a metadata file
    meta_path = os.path.join(DATA_DIR, "dataset_metadata.json")
    with open(meta_path, "w") as f:
        import json
        json.dump({
            "last_synced": datetime.now().isoformat(),
            "records_count": cleaned_len,
            "status": "Healthy"
        }, f)
        
    print(f"✅ Sync complete. Total active records: {cleaned_len}")
    return cleaned_len

if __name__ == "__main__":
    sync_data()
