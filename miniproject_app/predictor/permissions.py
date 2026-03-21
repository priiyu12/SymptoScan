from rest_framework.permissions import BasePermission

class IsDoctor(BasePermission):
    """
    Allows access only to users with role='doctor'.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'
