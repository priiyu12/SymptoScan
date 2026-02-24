from django.urls import path
from .views import create_consultation

urlpatterns = [
    path('request/', create_consultation),
]