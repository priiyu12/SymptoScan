from rest_framework import serializers
from .models import PredictionRecord


class PredictionInputSerializer(serializers.Serializer):
    symptoms = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False
    )


class PredictionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionRecord
        fields = ['id', 'symptoms', 'predicted_disease', 'confidence_score', 'precautions', 'created_at']