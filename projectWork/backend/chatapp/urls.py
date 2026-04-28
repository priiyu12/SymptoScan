from django.urls import path
from .views import ConsultationMessageListView

urlpatterns = [
    path('messages/<int:consultation_id>/', ConsultationMessageListView.as_view(), name='consultation-messages'),
]