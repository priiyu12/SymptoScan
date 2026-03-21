from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Authentication endpoints
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),

    # Custom app endpoints
    path('api/predict/', include('predictor.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/users/', include('users.urls')),
    path('api/predict/', include('predictor.urls')),  # Calls the predictor.urls file
    path('api/', include('predictor.urls')),

    path('auth/', include('djoser.urls')),                   # Adds default auth routes (register, etc.)
    path('auth/', include('djoser.urls.jwt')),               # Adds JWT routes (create/refresh/verify)
]
