import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
import os

# Paths
BASE_DIR = 'predictor/datasets'
ARCHIVE_1 = 'datasets/archive/dataset.csv'
ARCHIVE_3 = 'datasets/archive-3/dataset.csv'

def clean_symptoms(df):
    # Strip spaces from symptoms
    for col in df.columns:
        if col != 'Disease':
            df[col] = df[col].astype(str).str.strip().replace('nan', np.nan)
    return df

print("Loading original dataset...")
df1 = pd.read_csv(ARCHIVE_1)
df1 = clean_symptoms(df1)
print(f"Original shape: {df1.shape}")

print("Loading archive-3 dataset...")
df3 = pd.read_csv(ARCHIVE_3)
df3 = clean_symptoms(df3)
print(f"Archive-3 shape: {df3.shape}")

# Merge them. They both have 'Disease' and 'Symptom_x' formatted columns.
# We need to make sure their columns align. df1 has Symptom_1 to Symptom_17.
# df3 has Symptom_0 to Symptom_16. Let's rename df3 columns to match df1.
df3_renamed = df3.rename(columns={f'Symptom_{i}': f'Symptom_{i+1}' for i in range(17)})

# Combine
combined_df = pd.concat([df1, df3_renamed], ignore_index=True)
print(f"Combined shape: {combined_df.shape}")

# Now we need to prepare the data for the Random Forest model (One-Hot Encoding)
# The predictor API expects specific feature columns. I need to see what features the original model had.
try:
    feature_names = joblib.load(os.path.join(BASE_DIR, 'features.pkl'))
    label_encoder = joblib.load(os.path.join(BASE_DIR, 'label_encoder.pkl'))
    print(f"Loaded {len(feature_names)} features and label encoder.")
except:
    print("Could not load original features or encoder.")
    exit(1)

# To mimic the original training script, we flatten the symptoms and one-hot encode them.
symptoms = combined_df.iloc[:, 1:].values.flatten()
symptoms = pd.Series(symptoms).dropna().unique()
print(f"Total unique symptoms found in combined dataset: {len(symptoms)}")

# Create a master dataframe with one column for Disease, and one boolean column for each symptom
all_data = []
for index, row in combined_df.iterrows():
    disease = row['Disease']
    row_symptoms = [str(x) for x in row.iloc[1:].values if pd.notna(x)]
    data_dict = {'Disease': disease}
    for symp in feature_names: # Use original feature names to maintain API compatibility
        data_dict[symp] = 1 if symp in row_symptoms else 0
    
    # Also add any new symptoms that might not be in original features
    for symp in row_symptoms:
        if symp not in feature_names and symp != 'nan':
            data_dict[symp] = 1
            
    all_data.append(data_dict)

final_df = pd.DataFrame(all_data)
final_df = final_df.fillna(0)
print(f"Final training df shape: {final_df.shape}")

# Separate features and target
X = final_df.drop('Disease', axis=1)
y = final_df['Disease']

# Update feature names just in case new symptoms were added
new_feature_names = list(X.columns)

# We need to fit a new LabelEncoder if there are new diseases
from sklearn.preprocessing import LabelEncoder
new_label_encoder = LabelEncoder()
y_encoded = new_label_encoder.fit_transform(y)

print(f"Training Random Forest with {X.shape[1]} features and {len(new_label_encoder.classes_)} classes...")
rf = RandomForestClassifier(random_state=42)
rf.fit(X, y_encoded)

print("Training complete. Saving models...")
joblib.dump(rf, os.path.join(BASE_DIR, 'disease_prediction_model.pkl'))
joblib.dump(new_label_encoder, os.path.join(BASE_DIR, 'label_encoder.pkl'))
joblib.dump(new_feature_names, os.path.join(BASE_DIR, 'features.pkl'))
print("Models saved successfully!")

