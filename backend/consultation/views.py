from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Consultation

User = get_user_model()

@api_view(['POST'])
def create_consultation(request):

    doctor_id = request.data.get("doctor_id")

    if not doctor_id:
        return Response(
            {"error": "doctor_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        doctor = User.objects.get(id=doctor_id)
    except User.DoesNotExist:
        return Response(
            {"error": "Doctor not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    Consultation.objects.create(
        patient=request.user,
        doctor=doctor
    )

    return Response({"message": "Consultation request sent"})