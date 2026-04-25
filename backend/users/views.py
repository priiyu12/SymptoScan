from rest_framework.decorators import api_view, permission_classes  # Import DRF decorators for API views and permissions
from rest_framework.permissions import IsAuthenticated, IsAdminUser # Import permission classes

# Import Response and HTTP status codes
from rest_framework.response import Response 
from rest_framework import status

from rest_framework.pagination import PageNumberPagination # Pagination class for handling large datasets
from django.contrib.auth import get_user_model # Get custom User model

from .serializers import UserSerializer, DoctorSerializer # Import serializers for data conversion

# Import models
from .models import Doctor
from prediction.models import Prediction
from consultation.models import Consultation, ChatMessage

from django.db.models import Sum # For aggregation (e.g., total revenue)

User = get_user_model()

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctors_list(request):
    doctors = User.objects.filter(role='doctor', is_active=True, doctor_profile__is_available=True)
    serializer = UserSerializer(doctors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def admin_dashboard_stats(request):
    total_patients = User.objects.filter(role='patient').count()
    total_doctors = User.objects.filter(role='doctor').count()
    total_admins = User.objects.filter(role='admin').count()
    total_predictions = Prediction.objects.count()
    total_consultations = Consultation.objects.count()
    total_revenue = Consultation.objects.filter(is_paid=True).aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_admins": total_admins,
        "total_predictions": total_predictions,
        "total_consultations": total_consultations,
        "total_revenue": float(total_revenue)
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def doctor_availability(request):
    if request.user.role != 'doctor':
        return Response({"error": "Only doctors can set availability"}, status=status.HTTP_403_FORBIDDEN)
    
    doctor_profile = request.user.doctor_profile
    if request.method == 'POST':
        is_available = request.data.get('is_available', True)
        doctor_profile.is_available = is_available
        doctor_profile.save()
        return Response({"is_available": is_available})
    
    return Response({"is_available": doctor_profile.is_available})

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    users_queryset = User.objects.all().order_by('-date_joined')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(users_queryset, request)
    
    data = []
    users_to_serialize = page if page is not None else users_queryset
    
    for u in users_to_serialize:
        fee = 0
        if u.role == 'doctor' and hasattr(u, 'doctor_profile'):
            fee = float(u.doctor_profile.consultation_fee)

        data.append({
            "id": u.id,
            "name": u.full_name,
            "email": u.email,
            "role": u.role.capitalize(),
            "status": "Active" if u.is_active else "Inactive",
            "joined": u.date_joined.strftime("%Y-%m-%d"),
            "consultation_fee": fee
        })
    
    if page is not None:
        return paginator.get_paginated_response(data)
    return Response(data)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def manage_user(request, user_id):
    try:
        u = User.objects.get(id=int(user_id))
    except (User.DoesNotExist, ValueError):
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        fee = 0
        if u.role == 'doctor' and hasattr(u, 'doctor_profile'):
            fee = float(u.doctor_profile.consultation_fee)

        return Response({
            "id": u.id,
            "name": u.full_name,
            "email": u.email,
            "role": u.role,
            "status": "Active" if u.is_active else "Inactive",
            "consultation_fee": fee
        })

    if request.method == 'PUT':
        name = request.data.get('name') or request.data.get('full_name')
        role_raw = request.data.get('role', '')
        role = role_raw.lower() if isinstance(role_raw, str) else ''
        status_val = request.data.get('status', '')
        consultation_fee = request.data.get('consultation_fee')

        if name: u.full_name = name
        if role in ['admin', 'doctor', 'patient']:
            u.role = role
        if status_val:
            u.is_active = (str(status_val).lower() == 'active' or status_val is True)
        
        u.save()

        if u.role == 'doctor' and consultation_fee is not None:
            profile, created = Doctor.objects.get_or_create(user=u)
            profile.consultation_fee = float(consultation_fee)
            profile.save()
        
        return Response({"message": "User updated successfully", "id": u.id})

    if request.method == 'DELETE':
        if u.id == request.user.id:
            return Response({"error": "Cannot delete your own account"}, status=status.HTTP_400_BAD_REQUEST)
        if u.is_superuser:
            return Response({"error": "Cannot delete superuser"}, status=status.HTTP_403_FORBIDDEN)
        
        u.delete()
        return Response({"message": "User deleted successfully"})
