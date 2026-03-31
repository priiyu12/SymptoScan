from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Feedback
        fields = ['id', 'user', 'user_email', 'feedback_text', 'role', 'created_at']
        read_only_fields = ['user', 'role', 'created_at']
