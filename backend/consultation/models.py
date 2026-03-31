from django.db import models
from django.conf import settings

class Consultation(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    patient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="patient", on_delete=models.CASCADE)
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="doctor", on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)