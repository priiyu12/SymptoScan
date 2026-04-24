from django.contrib import admin
from django.urls import path, include

# Main URL configuration for the project
urlpatterns = [
    # Django admin panel
    path('admin/', admin.site.urls),

    # Authentication endpoints provided by Djoser (registration, login, etc.)
    path('api/auth/', include('djoser.urls')),

    # JWT authentication endpoints (token create/refresh/verify)
    path('api/auth/', include('djoser.urls.jwt')),

    # Custom user-related endpoints (profile, user management, etc.)
    path('api/users/', include('users.urls')),

    # Endpoints for prediction-related features (e.g., ML model predictions)
    path('api/prediction/', include('prediction.urls')),

    # Endpoints for consultation features (e.g., booking, sessions, etc.)
    path('api/consultation/', include('consultation.urls')),
]
