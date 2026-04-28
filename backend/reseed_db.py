import os
import django
import random
from datetime import timedelta
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Doctor
from prediction.models import Prediction
from consultation.models import Consultation, ChatMessage

User = get_user_model()

def reseed():
    print("Clearing existing data...")
    ChatMessage.objects.all().delete()
    Consultation.objects.all().delete()
    Prediction.objects.all().delete()
    Doctor.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()

    print("Seeding Users...")
    # Admin (if not exists)
    if not User.objects.filter(email='admin@symptoscan.com').exists():
        User.objects.create_superuser('admin@symptoscan.com', 'System Admin', 'admin123')
        print("- Admin created")

    # Doctors
    doctors_data = [
        ('dr.smith@symptoscan.com', 'Dr. John Smith', 'General Physician', 12, 600),
        ('dr.doe@symptoscan.com', 'Dr. Jane Doe', 'Dermatologist', 8, 800),
        ('dr.wilson@symptoscan.com', 'Dr. Robert Wilson', 'Cardiologist', 15, 1200),
        ('dr.brown@symptoscan.com', 'Dr. Emily Brown', 'Neurologist', 10, 1000),
        ('dr.garcia@symptoscan.com', 'Dr. Maria Garcia', 'Pediatrician', 7, 500),
    ]

    doctors = []
    for email, name, spec, exp, fee in doctors_data:
        u = User.objects.create_user(email, name, 'doctor123', role='doctor')
        # Doctor profile is automatically created by signal, just update it
        Doctor.objects.filter(user=u).update(
            specialization=spec, 
            years_of_experience=exp, 
            consultation_fee=fee, 
            is_available=True
        )
        doctors.append(u)
    print(f"- {len(doctors)} Doctors created")

    # Patients
    patients_data = [
        ('patient1@example.com', 'Sarah Connor', 'patient123'),
        ('patient2@example.com', 'Bruce Wayne', 'patient123'),
        ('test@patient.com', 'Test Patient', 'patient123'),
    ]

    patients = []
    for email, name, pwd in patients_data:
        u = User.objects.create_user(email, name, pwd, role='patient')
        patients.append(u)
    print(f"- {len(patients)} Patients created")

    print("Seeding Predictions...")
    diseases = ['Common Cold', 'Flu', 'Typhoid', 'Dengue', 'Migraine']
    symptoms_list = [
        {'fever': 1, 'cough': 1, 'fatigue': 1},
        {'fever': 1, 'headache': 1, 'nausea': 1},
        {'chills': 1, 'body_pain': 1, 'sneezing': 1},
    ]

    for p in patients:
        for _ in range(2):
            Prediction.objects.create(
                user=p,
                symptoms=random.choice(symptoms_list),
                predicted_disease=random.choice(diseases),
                confidence=round(random.uniform(75, 98), 2),
                created_at=timezone.now() - timedelta(days=random.randint(1, 30))
            )
    print("- Sample Predictions created")

    print("Seeding Consultations & Payments...")
    for p in patients:
        # One paid/active consultation
        doc = random.choice(doctors)
        c = Consultation.objects.create(
            patient=p,
            doctor=doc,
            status='ACTIVE',
            amount=doc.doctor_profile.consultation_fee,
            is_paid=True,
            razorpay_order_id=f"order_seed_{random.randint(1000, 9999)}",
            razorpay_payment_id=f"pay_seed_{random.randint(1000, 9999)}",
        )
        
        # Initial triage message
        ChatMessage.objects.create(
            consultation=c,
            sender=doc,
            content="Hello, I have reviewed your symptoms. How can I assist you further?",
            is_auto_response=True
        )

        # One pending consultation
        doc2 = random.choice([d for d in doctors if d != doc])
        Consultation.objects.create(
            patient=p,
            doctor=doc2,
            status='PENDING',
            amount=doc2.doctor_profile.consultation_fee,
            is_paid=False,
            razorpay_order_id=f"order_pend_{random.randint(1000, 9999)}",
        )
    print("- Sample Consultations and Chat History created")

    print("\nDatabase Reseeded Successfully! 🚀")

if __name__ == '__main__':
    reseed()



