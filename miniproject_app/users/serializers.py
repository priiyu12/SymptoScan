from rest_framework import serializers
from .models import CustomUser, Doctor

# User Serializer
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'full_name', 'role', 'date_joined')

# User Create Serializer
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'full_name', 'role', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        if user.role == 'doctor':
            Doctor.objects.create(
                user=user,
                specialization='General Practitioner',
                years_of_experience=1,
                license_number='PENDING'
            )
        return user

class DoctorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ('specialization', 'years_of_experience', 'license_number', 'is_available')

# Doctor List Serializer (for admin to view doctors)
class DoctorSerializer(serializers.ModelSerializer):
    doctor_profile = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'email', 'role', 'doctor_profile']

    def get_doctor_profile(self, obj):
        if hasattr(obj, 'doctor'):
            return DoctorProfileSerializer(obj.doctor).data
        return None
