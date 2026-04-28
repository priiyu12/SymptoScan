import os
import joblib
import numpy as np
import pandas as pd
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import Prediction

# Paths to the saved model and label encoder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'datasets', 'disease_prediction_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'datasets', 'label_encoder.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, 'datasets', 'features.pkl')

# Global variables for model and related assets
model = None
label_encoder = None
feature_names = None

def load_ml_assets():
    global model, label_encoder, feature_names
    if model is None:
        try:
            model = joblib.load(MODEL_PATH)
            label_encoder = joblib.load(ENCODER_PATH)
            feature_names = joblib.load(FEATURES_PATH)
        except Exception as e:
            print(f"Error loading ML assets: {e}")

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_disease(request):
    load_ml_assets()
    if model is None:
        return Response({"error": "ML model not loaded"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        data = request.data
        if not data:
            return Response({"error": "No symptoms provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Build input dataframe
        input_data = pd.DataFrame([data])
        
        # Ensure all feature columns are present and in correct order
        for feature in feature_names:
            if feature not in input_data.columns:
                input_data[feature] = 0
        
        input_data = input_data[feature_names]

        # Run prediction
        prediction = model.predict(input_data)
        predicted_disease = label_encoder.inverse_transform(prediction)[0]

        # Calculate confidence if possible
        confidence = 100.0
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_data)
            max_prob = np.max(probabilities)
            confidence = float(max_prob * 100)

        # Save to database
        Prediction.objects.create(
            user=request.user,
            symptoms=data,
            predicted_disease=predicted_disease,
            confidence=confidence
        )

        return Response({
            "prediction": predicted_disease,
            "confidence": f"{confidence:.2f}%"
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": f"Prediction failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def prediction_history(request):
    history = Prediction.objects.filter(user=request.user).order_by('-created_at')
    data = []
    for record in history:
        data.append({
            "id": record.id,
            "predicted_disease": record.predicted_disease,
            "confidence": f"{record.confidence:.2f}%",
            "symptoms": record.symptoms,
            "created_at": record.created_at
        })
    return Response({"history": data})
