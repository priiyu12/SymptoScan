import pandas as pd
import glob

print("--- Current Dataset ---")
df_curr = pd.read_csv("predictor/datasets/dataset.csv")
print("Shape:", df_curr.shape, "Unique Diseases:", df_curr.iloc[:,0].nunique())
print("Columns:", list(df_curr.columns)[:5], "...")

def inspect(path):
    print(f"\n--- {path} ---")
    try:
        df = pd.read_csv(path)
        print("Shape:", df.shape)
        if "Disease" in df.columns or "disease" in df.columns:
            dis_col = "Disease" if "Disease" in df.columns else "disease"
            print("Unique Diseases:", df[dis_col].nunique())
        print("Columns:", list(df.columns)[:10], "..." if len(df.columns) > 10 else "")
    except Exception as e:
        print("Error:", e)

for f in sorted(glob.glob("datasets/*/*.csv")):
    inspect(f)
