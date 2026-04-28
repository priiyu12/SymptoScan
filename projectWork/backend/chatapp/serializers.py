from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.full_name')
    sender_role = serializers.CharField(source='sender.role')

    class Meta:
        model = Message
        fields = [
            'id',
            'consultation',
            'sender',
            'sender_name',
            'sender_role',
            'content',
            'timestamp',
        ]