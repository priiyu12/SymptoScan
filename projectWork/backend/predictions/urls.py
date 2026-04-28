from django.urls import path
from .views import PredictDiseaseView, PredictionHistoryView

urlpatterns = [
    path('predict/', PredictDiseaseView.as_view(), name='predict-disease'),
    path('history/', PredictionHistoryView.as_view(), name='prediction-history'),
]