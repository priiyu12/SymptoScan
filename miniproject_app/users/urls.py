from django.urls import path
from .views import DoctorListAPIView, toggle_availability
from .admin_views import get_admin_dashboard_stats, get_all_users, manage_user

urlpatterns = [
    path('doctors/', DoctorListAPIView.as_view(), name='doctor-list'),
    path('availability/', toggle_availability, name='toggle-availability'),
    path('admin-dashboard/', get_admin_dashboard_stats, name='admin-dashboard'),
    path('all/', get_all_users, name='get-all-users'),
    path('manage/<int:user_id>/', manage_user, name='manage-user'),
]
