from django.urls import path
from .views import get_doctors_list, admin_dashboard_stats, get_all_users, doctor_availability, manage_user

urlpatterns = [
    path('doctors/', get_doctors_list, name='doctors-list'),
    path('admin-dashboard/', admin_dashboard_stats, name='admin-dashboard'),
    path('all/', get_all_users, name='all-users'),
    path('availability/', doctor_availability, name='doctor-availability'),
    path('manage/<int:user_id>/', manage_user, name='manage-user'),
]