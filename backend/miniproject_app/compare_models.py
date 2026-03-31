import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import os
import re

# Paths
BASE_DIR = 'predictor/datasets'
ARCHIVE_1 = 'datasets/archive/dataset.csv'
ARCHIVE_3 = 'datasets/archive-3/dataset.csv'

def clean_symptoms(df):
    for col in df.columns:
        if col != 'Disease':
            df[col] = df[col].astype(str).str.strip().replace('nan', np.nan)
    return df

print("Loading data...")
df1 = clean_symptoms(pd.read_csv(ARCHIVE_1))
df3 = clean_symptoms(pd.read_csv(ARCHIVE_3))

df3_renamed = df3.rename(columns={f'Symptom_{i}': f'Symptom_{i+1}' for i in range(17)})
combined_df = pd.concat([df1, df3_renamed], ignore_index=True)

try:
    feature_names = joblib.load(os.path.join(BASE_DIR, 'features.pkl'))
except:
    feature_names = list(combined_df.iloc[:, 1:].values.flatten())
    feature_names = [str(x) for x in feature_names if str(x) != 'nan']
    feature_names = list(set(feature_names))

symptoms = combined_df.iloc[:, 1:].values.flatten()
symptoms = pd.Series(symptoms).dropna().unique()

all_data = []
for index, row in combined_df.iterrows():
    disease = row['Disease']
    row_symptoms = [str(x) for x in row.iloc[1:].values if pd.notna(x)]
    data_dict = {'Disease': disease}
    for symp in feature_names: 
        data_dict[symp] = 1 if symp in row_symptoms else 0
    
    for symp in row_symptoms:
        if symp not in feature_names and symp != 'nan':
            data_dict[symp] = 1
            
    all_data.append(data_dict)

final_df = pd.DataFrame(all_data).fillna(0)

X = final_df.drop('Disease', axis=1)
y = final_df['Disease']

new_feature_names = list(X.columns)
from sklearn.preprocessing import LabelEncoder
new_label_encoder = LabelEncoder()
y_encoded = new_label_encoder.fit_transform(y)

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

print("\n--- Training Models ---")

# Random Forest
rf = RandomForestClassifier(random_state=42)
rf.fit(X_train, y_train)
rf_acc = accuracy_score(y_test, rf.predict(X_test))
print(f"Random Forest Accuracy: {rf_acc:.4f}")

# SVM
svm = SVC(random_state=42)
svm.fit(X_train, y_train)
svm_acc = accuracy_score(y_test, svm.predict(X_test))
print(f"SVM Accuracy: {svm_acc:.4f}")

# Select the best model
models = {'RandomForest': (rf_acc, rf), 'SVM': (svm_acc, svm)}
best_model_name, (best_acc, best_model) = max(models.items(), key=lambda item: item[1][0])

print(f"\nBest Model: {best_model_name} with Accuracy {best_acc:.4f}")
print("Training on full data with best model and saving...")

best_model.fit(X, y_encoded)
joblib.dump(best_model, os.path.join(BASE_DIR, 'disease_prediction_model.pkl'))
joblib.dump(new_label_encoder, os.path.join(BASE_DIR, 'label_encoder.pkl'))
joblib.dump(new_feature_names, os.path.join(BASE_DIR, 'features.pkl'))

# Generate TypeScript for Frontend
print("\nGenerating TS for frontend...")
ts_output = "export const symptoms: Symptom[] = [\n"
for i, feature in enumerate(new_feature_names):
    # e.g., 'abdominal_pain' -> 'Abdominal Pain'
    name = re.sub(r'_', ' ', feature).title()
    category = 'General'
    if 'pain' in feature or 'ache' in feature: category = 'Musculoskeletal'
    elif 'cough' in feature or 'breath' in feature: category = 'Respiratory'
    elif 'nausea' in feature or 'vomit' in feature or 'stomach' in feature or 'abdom' in feature: category = 'Digestive'
    elif 'rash' in feature or 'skin' in feature: category = 'Dermatological'
    elif 'dizzi' in feature or 'sensor' in feature or 'head' in feature: category = 'Neurological'
    
    ts_output += f"  {{ id: '{i+1}', name: '{name}', category: '{category}' }},\n"
ts_output += "];"

with open("new_symptoms.ts", "w") as f:
    f.write(ts_output)
print("Saved to new_symptoms.ts")

