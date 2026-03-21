from django.db import models
from users.models import CustomUser  # Adjust import based on your project structure

class Feedback(models.Model):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    feedback_text = models.TextField()
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.role}"
