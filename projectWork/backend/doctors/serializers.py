from rest_framework import serializers
from accounts.models import DoctorProfile


class DoctorListSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'full_name',
            'email',
            'specialization',
            'qualification',
            'experience_years',
            'consultation_fee',
            'available_status',
            'verified',
        ]


class DoctorDetailSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name')
    email = serializers.EmailField(source='user.email')
    role = serializers.CharField(source='user.role')

    class Meta:
        model = DoctorProfile
        fields = [
            'id',
            'full_name',
            'email',
            'role',
            'specialization',
            'qualification',
            'experience_years',
            'consultation_fee',
            'available_status',
            'verified',
            'bio',
            'created_at',
        ]