import random
import razorpay
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.conf import settings
from .models import Consultation, ChatMessage
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer, DoctorSerializer
from prediction.models import Prediction

User = get_user_model()

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# BOT RESPONSES
BOT_RESPONSES = [
    "Hello, I have reviewed your symptoms. How can I assist you further?",
    "Could you please describe the severity of your symptoms on a scale of 1-10?",
    "When did these symptoms first appear?",
    "Have you noticed any triggers that make the symptoms better or worse?",
    "Are you currently taking any medications for this condition?",
    "Do you have any known allergies to medications?",
    "Have you experienced any fever, chills, or night sweats recently?",
    "Is there any history of similar symptoms in your family?",
    "How has this affected your daily activities or work?",
    "Are you experiencing any other symptoms like dizziness or nausea?",
    "Have you travelled recently to any areas with known outbreaks?",
    "Do you smoke or consume alcohol regularly?",
    "Have you had any recent surgeries or hospitalizations?",
    "Have you tried any home remedies or over-the-counter treatments?",
    "Do you have any underlying medical conditions like diabetes or hypertension?",
    "Are your symptoms persistent, or do they come and go?",
    "Is there any specific time of day when your symptoms are more intense?",
    "Have you noticed any skin rashes or changes in your vision?",
    "Do you feel short of breath while resting or during physical activity?",
    "Thank you for the information. Our doctor will be with you shortly to review these details."
]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_consultation(request):
    doctor_id = request.data.get("doctor_id")
    if not doctor_id:
        return Response({"error": "doctor_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        doctor = User.objects.get(id=doctor_id, role='doctor')
    except User.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    amount = 500  
    if hasattr(doctor, 'doctor_profile'):
        amount = int(doctor.doctor_profile.consultation_fee)

    data = {
        "amount": amount * 100,  
        "currency": "INR",
        "receipt": f"consultation_{request.user.id}_{doctor.id}",
        "payment_capture": 1
    }
    
    is_simulated = (settings.RAZORPAY_KEY_ID == "rzp_test_placeholder")
    
    if not is_simulated:
        try:
            order = client.order.create(data=data)
        except Exception as e:
            print(f"Razorpay Error: {e}")
            is_simulated = True
            order = {"id": f"order_mock_{random.randint(1000, 9999)}", "amount": amount * 100}
    else:
        order = {"id": f"order_mock_{random.randint(1000, 9999)}", "amount": amount * 100}

    consultation = Consultation.objects.create(
        patient=request.user,
        doctor=doctor,
        amount=amount,
        razorpay_order_id=order['id'],
        status='PENDING'
    )

    return Response({
        "consultation_id": consultation.id,
        "razorpay_order_id": order['id'],
        "amount": amount,
        "currency": "INR",
        "key_id": settings.RAZORPAY_KEY_ID,
        "is_simulated": is_simulated
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    consultation_id = request.data.get("consultation_id")
    razorpay_order_id = request.data.get("razorpay_order_id")
    razorpay_payment_id = request.data.get("razorpay_payment_id")
    razorpay_signature = request.data.get("razorpay_signature")

    try:
        consultation = Consultation.objects.get(id=consultation_id, razorpay_order_id=razorpay_order_id)
        consultation.is_paid = True
        consultation.status = 'ACTIVE'
        consultation.razorpay_payment_id = razorpay_payment_id
        consultation.razorpay_signature = razorpay_signature
        consultation.save()

        ChatMessage.objects.create(
            consultation=consultation,
            sender=consultation.doctor, 
            content=BOT_RESPONSES[0],
            is_auto_response=True
        )

        return Response({"message": "Payment verified and chat activated", "status": "ACTIVE"})
    
    except Consultation.DoesNotExist:
        return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    consultation_id = request.data.get("consultation_id")
    content = request.data.get("content")

    try:
        consultation = Consultation.objects.get(id=consultation_id)
        
        if not consultation.is_paid:
            return Response({"error": "Payment required for chat"}, status=status.HTTP_403_FORBIDDEN)

        message = ChatMessage.objects.create(
            consultation=consultation,
            sender=request.user,
            content=content
        )

        if request.user.role == 'patient':
            msg_count = consultation.messages.filter(sender=request.user).count()
            if msg_count <= 3: 
                bot_msg = BOT_RESPONSES[msg_count] if msg_count < len(BOT_RESPONSES) else random.choice(BOT_RESPONSES)
                ChatMessage.objects.create(
                    consultation=consultation,
                    sender=consultation.doctor,
                    content=bot_msg,
                    is_auto_response=True
                )

        return Response({"status": "sent"})

    except Consultation.DoesNotExist:
        return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, consultation_id):
    try:
        consultation = Consultation.objects.get(id=consultation_id)
        if not (request.user == consultation.patient or request.user == consultation.doctor or request.user.role == 'admin'):
             return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        messages = consultation.messages.all().order_by('timestamp')
        data = []
        for msg in messages:
            data.append({
                "id": msg.id,
                "sender": msg.sender.full_name,
                "sender_id": msg.sender.id,
                "content": msg.content,
                "is_auto_response": msg.is_auto_response,
                "timestamp": msg.timestamp
            })
        return Response(data)
    except Consultation.DoesNotExist:
        return Response({"error": "Consultation not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_consultations(request):
    if request.user.role == 'doctor':
        consultations_qs = Consultation.objects.filter(doctor=request.user).order_by('-created_at')
    elif request.user.role == 'patient':
        consultations_qs = Consultation.objects.filter(patient=request.user).order_by('-created_at')
    else:
        consultations_qs = Consultation.objects.all().order_by('-created_at')
    
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(consultations_qs, request)
    
    data = []
    consultations_to_serialize = page if page is not None else consultations_qs
    
    for c in consultations_to_serialize:
        latest_prediction = Prediction.objects.filter(user=c.patient).order_by('-created_at').first()
        prediction_data = None
        if latest_prediction:
            prediction_data = {
                "disease": latest_prediction.predicted_disease,
                "confidence": latest_prediction.confidence,
                "symptoms": latest_prediction.symptoms
            }

        data.append({
            "id": c.id,
            "patient": c.patient.full_name,
            "patient_email": c.patient.email,
            "patient_id": c.patient.id,
            "doctor": c.doctor.full_name,
            "doctor_id": c.doctor.id,
            "status": c.status,
            "is_paid": c.is_paid,
            "amount": float(c.amount),
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M"),
            "prediction": prediction_data
        })
    
    if page is not None:
        return paginator.get_paginated_response(data)
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_history(request):
    if not request.user.is_staff and request.user.role != 'admin':
        return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
    
    payments_qs = Consultation.objects.filter(is_paid=True).order_by('-updated_at')
    paginator = StandardResultsSetPagination()
    page = paginator.paginate_queryset(payments_qs, request)
    
    data = []
    payments_to_serialize = page if page is not None else payments_qs
    
    for p in payments_to_serialize:
        data.append({
            "id": p.id,
            "transaction_id": p.razorpay_payment_id or f"MOCK_{p.id}",
            "order_id": p.razorpay_order_id,
            "patient": p.patient.full_name,
            "doctor": p.doctor.full_name,
            "amount": float(p.amount),
            "status": "Success",
            "date": p.updated_at.strftime("%Y-%m-%d %H:%M"),
            "mode": "Razorpay"
        })
    
    if page is not None:
        return paginator.get_paginated_response(data)
    return Response(data)