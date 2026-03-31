from rest_framework import serializers
from .models import PredictionHistory
from .models import ChatRoom, Message


class PredictionHistorySerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = PredictionHistory
        fields = ['id', 'user_email', 'predicted_disease', 'symptoms', 'created_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.full_name', read_only=True)

    class Meta:
        model = ChatRoom
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender_role = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'room', 'sender', 'content', 'timestamp', 'sender_role']

    def get_sender_role(self, obj):
        return obj.sender.role
