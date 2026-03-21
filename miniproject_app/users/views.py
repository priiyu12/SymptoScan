from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CustomUser, Doctor
from .serializers import DoctorSerializer

class DoctorListAPIView(ListAPIView):
    # Only show available doctors
    queryset = CustomUser.objects.filter(role='doctor', doctor__is_available=True)
    serializer_class = DoctorSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def toggle_availability(request):
    try:
        doctor = request.user.doctor
        if request.method == 'POST':
            is_available = request.data.get('is_available', True)
            doctor.is_available = is_available
            doctor.save()
        return Response({'is_available': doctor.is_available})
    except Doctor.DoesNotExist:
        return Response({'error': 'User is not a doctor'}, status=400)
