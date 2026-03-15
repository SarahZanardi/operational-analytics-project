
import pandas as pd

print("Loading dataset...")

df = pd.read_csv("data/raw/tickets.csv")

print("Standardizing columns...")
df.columns = df.columns.str.lower().str.replace(" ", "_")

print("Converting dates...")
if 'created_at' in df.columns:
    df['created_at'] = pd.to_datetime(df['created_at'], errors='coerce')

if 'closed_at' in df.columns:
    df['closed_at'] = pd.to_datetime(df['closed_at'], errors='coerce')

print("Calculating resolution time...")
if 'created_at' in df.columns and 'closed_at' in df.columns:
    df['resolution_time_hours'] = (
        df['closed_at'] - df['created_at']
    ).dt.total_seconds() / 3600

print("Saving processed data...")
df.to_parquet("data/processed/tickets_clean.parquet")

print("Pipeline finished.")
