import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
import joblib

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Dataset path
DATASET_PATH = os.path.join(BASE_DIR, '..', 'predictor', 'datasets', 'dataset.csv')

# Load dataset
try:
    df = pd.read_csv(DATASET_PATH)
    print("✅ Dataset loaded successfully!\n")
except FileNotFoundError as e:
    print(f"❌ Error: {e}")
    exit(1)

# Ensure 'Disease' column exists
if 'Disease' not in df.columns:
    print("❌ Error: 'Disease' column missing in dataset.")
    exit(1)

# ✅ Step 1: Create a set of all unique symptoms in the dataset
symptom_columns = [col for col in df.columns if col != 'Disease']

# Flatten the list of symptoms in each row to create a full list
all_symptoms = set()

for index, row in df.iterrows():
    for col in symptom_columns:
        symptom = row[col]
        if pd.notna(symptom) and symptom != '':
            all_symptoms.add(symptom.strip())

all_symptoms = sorted(all_symptoms)
print(f"✅ Total unique symptoms found: {len(all_symptoms)}")

# ✅ Step 2: Initialize an empty dataframe for new features
new_df = pd.DataFrame(0, index=df.index, columns=all_symptoms)

# ✅ Step 3: Fill the dataframe with 1 where the symptom is present
for index, row in df.iterrows():
    for col in symptom_columns:
        symptom = row[col]
        if pd.notna(symptom) and symptom != '':
            symptom = symptom.strip()
            if symptom in new_df.columns:
                new_df.at[index, symptom] = 1

# ✅ Step 4: Define X and y
X = new_df  # Features as binary indicators of symptoms
y = df['Disease']  # Target

# ✅ Step 5: Encode target (Disease)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# ✅ Step 6: Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# ✅ Step 7: Train the RandomForest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ✅ Step 8: Evaluate accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Accuracy: {accuracy:.2f}")

# ✅ Step 9: Save the trained model and label encoder
MODEL_PATH = os.path.join(BASE_DIR, '..', 'predictor', 'datasets', 'disease_prediction_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, '..', 'predictor', 'datasets', 'label_encoder.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, '..', 'predictor', 'datasets', 'features.pkl')

joblib.dump(model, MODEL_PATH)
joblib.dump(label_encoder, ENCODER_PATH)
joblib.dump(all_symptoms, FEATURES_PATH)

print(f"✅ Model saved at: {MODEL_PATH}")
print(f"✅ Label Encoder saved at: {ENCODER_PATH}")
print(f"✅ Features (symptoms) saved at: {FEATURES_PATH}")


print(df.head())