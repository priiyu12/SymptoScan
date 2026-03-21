import joblib
import os
import re

BASE_DIR = 'predictor/datasets'
feature_names = joblib.load(os.path.join(BASE_DIR, 'features.pkl'))

ts_output = "export const symptoms: Symptom[] = [\n"
for i, feature in enumerate(feature_names):
    name = re.sub(r'_', ' ', feature).title()
    category = 'General'
    if 'pain' in feature or 'ache' in feature: category = 'Musculoskeletal'
    elif 'cough' in feature or 'breath' in feature: category = 'Respiratory'
    elif 'nausea' in feature or 'vomit' in feature or 'stomach' in feature or 'abdom' in feature: category = 'Digestive'
    elif 'rash' in feature or 'skin' in feature: category = 'Dermatological'
    elif 'dizzi' in feature or 'sensor' in feature or 'head' in feature: category = 'Neurological'
    
    # Escape quotes if any exist in the feature name
    val = feature.replace("'", "\\'")
    ts_output += f"  {{ id: '{i+1}', name: '{name}', category: '{category}', value: '{val}' }},\n"
ts_output += "];"

with open("new_symptoms2.ts", "w") as f:
    f.write(ts_output)
print("Saved to new_symptoms2.ts")
