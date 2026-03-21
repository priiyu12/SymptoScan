from django.urls import path
from . import views
from .views import (
    predict_disease, prediction_history_list,
    get_or_create_chatroom, send_message, get_messages, doctor_chatrooms
)

urlpatterns = [
    path('', views.predict_disease, name='predict_disease'),
    path('history/', views.prediction_history_list, name='prediction_history_list'),

     # Chat Routes
    path('chatroom/', get_or_create_chatroom),              # POST: patient gets/creates chatroom
    path('send-message/', send_message),                   # POST: send a message
    path('messages/<int:room_id>/', get_messages),        # GET: fetch messages (polling)
    path('doctor-chatrooms/', doctor_chatrooms),          # GET: doctor views patient chatrooms
]   