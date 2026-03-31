import os
import joblib
import numpy as np
import pandas as pd
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import PredictionHistory
from .permissions import IsDoctor

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to the saved model and label encoder
MODEL_PATH = os.path.join(BASE_DIR, 'datasets', 'disease_prediction_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'datasets', 'label_encoder.pkl')
FEATURES_PATH = os.path.join(BASE_DIR, 'datasets', 'features.pkl')

# Load the trained model, label encoder, and feature names
model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)
feature_names = joblib.load(FEATURES_PATH)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict_disease(request):
    try:
        # ✅ Get the JSON payload
        data = request.data

        if not data:
            return JsonResponse({"error": "No symptoms provided"}, status=400)

        # ✅ Build input dataframe from the symptom data
        input_data = pd.DataFrame([data])  # Wrap dict in list to make DataFrame

        # ✅ Sanity check: Ensure all feature columns are present
        for feature in feature_names:
            if feature not in input_data.columns:
                input_data[feature] = 0

        # ✅ Reorder columns to match the model's training data
        input_data = input_data[feature_names]

        # ✅ Run prediction
        prediction = model.predict(input_data)
        predicted_disease = label_encoder.inverse_transform(prediction)[0]

        # ✅ Save prediction history in the database
        PredictionHistory.objects.create(
            user=request.user,
            predicted_disease=predicted_disease,
            symptoms=data  # Save the full dictionary of symptoms for history
        )

        return JsonResponse({"prediction": predicted_disease}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Prediction failed: {str(e)}"}, status=500)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def prediction_history_list(request):
    try:
        history = PredictionHistory.objects.filter(user=request.user).order_by('-created_at')

        history_list = []
        for record in history:
            history_list.append({
                "predicted_disease": record.predicted_disease,
                "symptoms": record.symptoms,
                "created_at": record.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return JsonResponse({"history": history_list}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"Failed to retrieve history: {str(e)}"}, status=500)

from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework import status

# Create or get chatroom
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_or_create_chatroom(request):
    doctor_id = request.data.get('doctor_id')

    if not doctor_id:
        return JsonResponse({'error': 'Doctor ID is required'}, status=400)

    try:
        room, created = ChatRoom.objects.get_or_create(
            patient=request.user,
            doctor_id=doctor_id
        )

        serializer = ChatRoomSerializer(room)
        return JsonResponse(serializer.data, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Send message
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    room_id = request.data.get('room_id')
    content = request.data.get('content')

    if not room_id or not content:
        return JsonResponse({'error': 'room_id and content are required'}, status=400)

    try:
        room = ChatRoom.objects.get(id=room_id)

        message = Message.objects.create(
            room=room,
            sender=request.user,
            content=content
        )

        serializer = MessageSerializer(message)
        return JsonResponse(serializer.data, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Get messages (polling)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, room_id):
    try:
        messages = Message.objects.filter(room_id=room_id).order_by('timestamp')
        serializer = MessageSerializer(messages, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

# Doctor: get all chatrooms (their patients)
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsDoctor])
def doctor_chatrooms(request):
    try:
        rooms = ChatRoom.objects.filter(doctor=request.user)
        serializer = ChatRoomSerializer(rooms, many=True)
        return JsonResponse(serializer.data, safe=False, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
