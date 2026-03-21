import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'miniproject.settings')
django.setup()

from users.models import CustomUser, Doctor
from feedback.models import Feedback
from predictor.models import PredictionHistory

def run_seed():
    print("Seeding database...")
    
    # 1. Create Admin
    admin_email = 'admin@example.com'
    if not CustomUser.objects.filter(email=admin_email).exists():
        CustomUser.objects.create_superuser(admin_email, 'System Admin', 'admin123')
        print(f"Created admin: {admin_email}")

    # 2. Create Doctors
    for i in range(1, 4):
        email = f'doctor{i}@example.com'
        if not CustomUser.objects.filter(email=email).exists():
            doc_user = CustomUser.objects.create_user(email, f'Dr. Smith {i}', 'doctor123', role='doctor')
            Doctor.objects.create(user=doc_user, specialization='General Practice', years_of_experience=10+i, license_number=f'DOC-LIC-{i}')
            print(f"Created doctor: {email}")

    # 3. Create Patients
    for i in range(1, 6):
        email = f'patient{i}@example.com'
        if not CustomUser.objects.filter(email=email).exists():
            CustomUser.objects.create_user(email, f'Patient John {i}', 'patient123', role='patient')
            print(f"Created patient: {email}")

    # 4. Generate Feedback
    patient = CustomUser.objects.filter(role='patient').first()
    doctor = CustomUser.objects.filter(role='doctor').first()

    if patient and not Feedback.objects.filter(user=patient).exists():
        Feedback.objects.create(user=patient, role='patient', feedback_text='The SymptomScan is very accurate!')
        Feedback.objects.create(user=patient, role='patient', feedback_text='I love the clean UI.')
        print("Created patient feedback.")

    if doctor and not Feedback.objects.filter(user=doctor).exists():
        Feedback.objects.create(user=doctor, role='doctor', feedback_text='The dashboard helps me track my patients easily.')
        print("Created doctor feedback.")

    # 5. Generate Predictions
    if patient and not PredictionHistory.objects.filter(user=patient).exists():
        PredictionHistory.objects.create(user=patient, predicted_disease='Common Cold', symptoms=['cough', 'fever', 'runny nose'])
        PredictionHistory.objects.create(user=patient, predicted_disease='Allergy', symptoms=['sneezing', 'itching'])
        PredictionHistory.objects.create(user=patient, predicted_disease='Migraine', symptoms=['headache', 'nausea'])
        print("Created prediction history.")

    print("Database seeding completed successfully!")

if __name__ == '__main__':
    run_seed()
