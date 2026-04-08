from django.urls import path
from .views import predict_disease, prediction_history

urlpatterns = [
    path('predict/', predict_disease, name='predict-disease'),
    path('history/', prediction_history, name='prediction-history'),
]