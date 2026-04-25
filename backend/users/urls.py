# Import Django's path function to define URL routes
from django.urls import path

# Import views that will handle each route
from .views import get_doctors_list, admin_dashboard_stats, get_all_users, doctor_availability, manage_user

# Define URL patterns for this app
urlpatterns = [
    
    # Endpoint to fetch list of doctors
    # Example: /doctors/
    path('doctors/', get_doctors_list, name='doctors-list'),
    
    # Endpoint for admin dashboard statistics (e.g., total users, doctors, etc.)
    # Example: /admin-dashboard/
    path('admin-dashboard/', admin_dashboard_stats, name='admin-dashboard'),
    
    # Endpoint to retrieve all users in the system
    # Example: /all/
    path('all/', get_all_users, name='all-users'),
    
    # Endpoint to check or update doctor availability
    # Example: /availability/
    path('availability/', doctor_availability, name='doctor-availability'),
    
    # Endpoint to manage a specific user by their ID (e.g., activate, deactivate, update role)
    # Example: /manage/1/
    path('manage/<int:user_id>/', manage_user, name='manage-user'),
]
