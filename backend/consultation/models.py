# consultations/models.py
# Handles consultation booking, payment tracking, and chat messaging models

from django.db import models
from django.conf import settings


class Consultation(models.Model):
    # Consultation status options
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PAID', 'Paid'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    )

    # User relationships
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="consultations", on_delete=models.CASCADE)
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="doctor_consultations", on_delete=models.CASCADE)

    # Consultation details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)

    # Razorpay payment information
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)

    # Payment flag
    is_paid = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.patient.full_name} -> {self.doctor.full_name} ({self.status})"


class ChatMessage(models.Model):
    # Consultation chat messages between doctor and patient

    consultation = models.ForeignKey(Consultation, related_name="messages", on_delete=models.CASCADE)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Message content
    content = models.TextField()

    # Auto-generated reply indicator
    is_auto_response = models.BooleanField(default=False)

    # Message timestamp
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.sender.full_name} at {self.timestamp}"
