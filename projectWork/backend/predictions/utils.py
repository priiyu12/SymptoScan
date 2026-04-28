def dummy_predict_disease(symptoms):
    symptoms_lower = [symptom.lower() for symptom in symptoms]

    if 'fever' in symptoms_lower and 'cough' in symptoms_lower:
        return {
            'predicted_disease': 'Flu',
            'confidence_score': 0.87,
            'precautions': 'Take rest, drink plenty of fluids, and consult a doctor if symptoms worsen.'
        }

    elif 'headache' in symptoms_lower and 'nausea' in symptoms_lower:
        return {
            'predicted_disease': 'Migraine',
            'confidence_score': 0.82,
            'precautions': 'Avoid bright light, take proper rest, and stay hydrated.'
        }

    elif 'chest pain' in symptoms_lower:
        return {
            'predicted_disease': 'Cardiac Concern',
            'confidence_score': 0.91,
            'precautions': 'Seek immediate medical attention.'
        }

    else:
        return {
            'predicted_disease': 'General Viral Infection',
            'confidence_score': 0.70,
            'precautions': 'Monitor symptoms, rest well, and consult a doctor if needed.'
        }