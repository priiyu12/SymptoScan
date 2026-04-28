import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from users.models import Doctor

User = get_user_model()

def seed():
    # Admin
    if not User.objects.filter(email='admin@symptoscan.com').exists():
        User.objects.create_superuser('admin@symptoscan.com', 'System Admin', 'admin123')
        print("Admin created.")

    # Doctors
    d1_email = 'dr.smith@symptoscan.com'
    if not User.objects.filter(email=d1_email).exists():
        u = User.objects.create_user(d1_email, 'Dr. John Smith', 'doctor123', role='doctor')
        Doctor.objects.create(user=u, specialization='General Physician', years_of_experience=10, consultation_fee=600)
        print("Doctor Smith created.")

    d2_email = 'dr.doe@symptoscan.com'
    if not User.objects.filter(email=d2_email).exists():
        u = User.objects.create_user(d2_email, 'Dr. Jane Doe', 'doctor123', role='doctor')
        Doctor.objects.create(user=u, specialization='Dermatologist', years_of_experience=8, consultation_fee=800)
        print("Doctor Doe created.")

    # Patient
    p_email = 'patient@example.com'
    if not User.objects.filter(email=p_email).exists():
        User.objects.create_user(p_email, 'Test Patient', 'patient123', role='patient')
        print("Test Patient created.")



if __name__ == '__main__':
    seed()
