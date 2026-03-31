from django.urls import path
from .views import SubmitSymptomsView, SymptomHistoryView

urlpatterns = [
    path('submit/', SubmitSymptomsView.as_view(), name='submit-symptoms'),
    path('history/', SymptomHistoryView.as_view(), name='symptoms-history'),
]
