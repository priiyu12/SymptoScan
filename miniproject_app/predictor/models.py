# Create your models here.
from django.db import models
from django.conf import settings

class PredictionHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    predicted_disease = models.CharField(max_length=100)
    symptoms = models.JSONField()  # stores selected symptoms as JSON (list or dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.predicted_disease} at {self.created_at}"


from django.db import models
from django.conf import settings

class ChatRoom(models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chatrooms_as_patient')
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chatrooms_as_doctor')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat between {self.patient.email} and Dr. {self.doctor.email}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.email}: {self.content[:20]}..."

