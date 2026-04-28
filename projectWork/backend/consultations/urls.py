from django.urls import path
from .views import (
    ConsultationRequestView,
    MyConsultationsView,
    UpdateConsultationStatusView
)

urlpatterns = [
    path('request/', ConsultationRequestView.as_view(), name='consultation-request'),
    path('my/', MyConsultationsView.as_view(), name='my-consultations'),
    path('<int:pk>/status/', UpdateConsultationStatusView.as_view(), name='update-consultation-status'),
]