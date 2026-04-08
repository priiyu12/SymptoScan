from django.urls import path
from .views import (
    create_consultation, 
    verify_payment, 
    send_message, 
    get_messages, 
    get_consultations,
    get_payment_history
)

urlpatterns = [
    path('request/', create_consultation, name='create-consultation'),
    path('verify/', verify_payment, name='verify-payment'),
    path('chat/send/', send_message, name='send-message'),
    path('chat/<int:consultation_id>/', get_messages, name='get-messages'),
    path('history/', get_consultations, name='consultation-history'),
    path('payments/', get_payment_history, name='payment-history'),
]