from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, PatientProfile, DoctorProfile


class RegisterSerializer(serializers.ModelSerializer):
    specialization = serializers.CharField(required=False)
    qualification = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(required=False)
    consultation_fee = serializers.FloatField(required=False)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'full_name',
            'password',
            'role',
            'specialization',
            'qualification',
            'experience_years',
            'consultation_fee',
        ]

    def validate(self, data):
        if data.get('role') == 'doctor' and not data.get('specialization'):
            raise serializers.ValidationError({
                'specialization': 'This field is required for doctors.'
            })
        return data

    def create(self, validated_data):
        role = validated_data.get('role')

        specialization = validated_data.pop('specialization', None)
        qualification = validated_data.pop('qualification', '')
        experience_years = validated_data.pop('experience_years', 0)
        consultation_fee = validated_data.pop('consultation_fee', 0)

        user = User.objects.create_user(
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
            password=validated_data['password'],
        )

        if role == 'patient':
            PatientProfile.objects.create(user=user)
        elif role == 'doctor':
            DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                qualification=qualification,
                experience_years=experience_years,
                consultation_fee=consultation_fee,
            )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            email=data.get('email'),
            password=data.get('password'),
        )

        if not user:
            raise serializers.ValidationError({'detail': 'Invalid credentials'})

        refresh = RefreshToken.for_user(user)

        return {
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'full_name', 'role']
