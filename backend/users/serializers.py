from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreatePasswordRetypeSerializer
from .models import Doctor

User = get_user_model()

class DoctorSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Doctor
        fields = ('id', 'user', 'full_name', 'email', 'specialization', 'years_of_experience', 'is_available', 'consultation_fee')

class UserSerializer(serializers.ModelSerializer):
    doctor_profile = DoctorSerializer(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'role', 'doctor_profile')

class UserCreateSerializer(UserCreatePasswordRetypeSerializer):
    specialization = serializers.CharField(required=False, write_only=True)
    consultation_fee = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, write_only=True)

    class Meta(UserCreatePasswordRetypeSerializer.Meta):
        model = User
        fields = ('id', 'email', 'full_name', 'password', 'role', 'specialization', 'consultation_fee')

    def create(self, validated_data):
        # Djoser calls this. The signal will create the Doctor profile.
        # We pop the extra fields to pass clean data to create_user
        spec = validated_data.pop('specialization', None)
        fee = validated_data.pop('consultation_fee', None)
        
        user = User.objects.create_user(**validated_data)

        # After user is created, Signal has already created the Doctor profile.
        # Now we update it with the specific values if they were provided.
        if user.role == 'doctor' and (spec or fee):
            profile, created = Doctor.objects.get_or_create(user=user)
            if spec: profile.specialization = spec
            if fee: profile.consultation_fee = fee
            profile.save()
            
        return user