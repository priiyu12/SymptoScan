from rest_framework import serializers
from .models import Symptom  # your model name

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = '__all__'  # or specify fields like ['id', 'name']
