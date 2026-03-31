# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import Prediction
# import joblib
# import numpy as np

# # model = joblib.load("prediction/disease_model.pkl")

# @api_view(['POST'])
# def predict_disease(request):

#     symptoms = request.data.get("symptoms")

#     prediction = model.predict([symptoms])
#     probabilities = model.predict_proba([symptoms])

#     confidence = max(probabilities[0]) * 100

#     # Save to DB
#     Prediction.objects.create(
#         user=request.user,
#         symptoms=symptoms,
#         predicted_disease=prediction[0],
#         confidence=confidence
#     )

#     return Response({
#         "disease": prediction[0],
#         "confidence": round(confidence, 2)
#     })

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Prediction
from django.contrib.auth import get_user_model
from consultation.models import Consultation

class PredictView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        symptoms = request.data.get("symptoms")

        # Dummy ML response
        disease = "Common Flu"
        confidence = 87.34

        Prediction.objects.create(
            user=request.user,
            symptoms=symptoms,
            predicted_disease=disease,
            confidence=confidence
        )

        return Response({
            "disease": disease,
            "confidence": confidence
        })