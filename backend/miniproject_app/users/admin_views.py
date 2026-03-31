from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission
from rest_framework.response import Response
from feedback.models import Feedback

class IsRoleAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

# Optional import, if model exists
try:
    from predictor.models import PredictionHistory
except ImportError:
    PredictionHistory = None

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsRoleAdmin])
def get_admin_dashboard_stats(request):
    total_patients = User.objects.filter(role='patient').count()
    total_doctors = User.objects.filter(role='doctor').count()
    total_admins = User.objects.filter(role='admin').count()
    total_feedbacks = Feedback.objects.count()
    total_predictions = PredictionHistory.objects.count() if PredictionHistory else 0

    return Response({
        "total_patients": total_patients,
        "total_doctors": total_doctors,
        "total_admins": total_admins,
        "total_feedbacks": total_feedbacks,
        "total_predictions": total_predictions
    })

from rest_framework import status
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsRoleAdmin])
def get_all_users(request):
    users = User.objects.all().order_by('-date_joined')
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'name': user.full_name or 'Unknown',
            'email': user.email,
            'role': user.role.capitalize() if user.role else 'User',
            'status': 'Active' if user.is_active else 'Inactive',
            'joined': user.date_joined.strftime('%Y-%m-%d') if user.date_joined else timezone.now().strftime('%Y-%m-%d')
        })
    return Response(data)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsRoleAdmin])
def manage_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
    elif request.method == 'PUT':
        user.full_name = request.data.get('name', user.full_name)
        role = request.data.get('role', user.role)
        if role and role.lower() in ['patient', 'doctor', 'admin']:
            user.role = role.lower()
            if user.role == 'doctor' and not hasattr(user, 'doctor'):
                from users.models import Doctor
                Doctor.objects.create(
                    user=user,
                    specialization='General Practitioner',
                    years_of_experience=1,
                    license_number='PENDING'
                )
        
        status_val = request.data.get('status')
        if status_val == 'Active':
            user.is_active = True
        elif status_val == 'Inactive':
            user.is_active = False
            
        user.save()
        return Response({'message': 'User updated successfully'})
