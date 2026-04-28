from rest_framework import serializers
from .models import Consultation
from accounts.models import DoctorProfile
from predictions.models import PredictionRecord


class ConsultationCreateSerializer(serializers.ModelSerializer):
    doctor_id = serializers.IntegerField(write_only=True)
    prediction_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Consultation
        fields = ['doctor_id', 'prediction_id', 'notes']

    def create(self, validated_data):
        user = self.context['request'].user

        doctor_id = validated_data.pop('doctor_id')
        prediction_id = validated_data.pop('prediction_id', None)

        doctor = DoctorProfile.objects.get(id=doctor_id)

        prediction = None
        if prediction_id:
            prediction = PredictionRecord.objects.get(id=prediction_id)

        consultation = Consultation.objects.create(
            patient=user,
            doctor=doctor,
            prediction=prediction,
            **validated_data
        )

        return consultation


class ConsultationSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name')
    doctor_name = serializers.CharField(source='doctor.user.full_name')
    doctor_specialization = serializers.CharField(source='doctor.specialization')

    class Meta:
        model = Consultation
        fields = [
            'id',
            'patient_name',
            'doctor_name',
            'doctor_specialization',
            'status',
            'notes',
            'created_at',
        ]