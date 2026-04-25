# Import required Django modules for authentication and models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.timezone import now
from django.db.models.signals import post_save
from django.dispatch import receiver

# Define user roles available in the system
USER_ROLES = (
    ('patient', 'Patient'),
    ('doctor', 'Doctor'),
    ('admin', 'Admin'),
)

# Custom User Manager to handle user creation logic
class CustomUserManager(BaseUserManager):
    
    # Method to create a normal user
    def create_user(self, email, full_name, password=None, role='patient'):
        # Ensure email is provided
        if not email:
            raise ValueError("Email is required")
        
        # Normalize email format
        email = self.normalize_email(email)
        
        # Create user instance
        user = self.model(email=email, full_name=full_name, role=role)
        
        # Hash and set password
        user.set_password(password)
        
        # Save user to database
        user.save(using=self._db)
        return user

    # Method to create a superuser (admin)
    def create_superuser(self, email, full_name, password):
        # Create user with admin role
        user = self.create_user(email=email, full_name=full_name, password=password, role='admin')
        
        # Grant admin privileges
        user.is_staff = True
        user.is_superuser = True
        
        # Save updated user
        user.save(using=self._db)
        return user

# Custom User model extending Django's base user classes
class User(AbstractBaseUser, PermissionsMixin):
    
    # User email (used as username)
    email = models.EmailField(unique=True)
    
    # Full name of the user
    full_name = models.CharField(max_length=100)
    
    # Role of the user (patient, doctor, admin)
    role = models.CharField(max_length=10, choices=USER_ROLES, default='patient')
    
    # Timestamp when user joined
    date_joined = models.DateTimeField(default=now)

    # Status flags
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Attach custom manager
    objects = CustomUserManager()

    # Field used for login instead of username
    USERNAME_FIELD = 'email'
    
    # Required fields when creating a superuser
    REQUIRED_FIELDS = ['full_name', 'role']

    # Override save method to automate admin privileges
    def save(self, *args, **kwargs):
        # Automatically set staff status if role is admin
        if self.role == 'admin':
            self.is_staff = True
        super().save(*args, **kwargs)

    # String representation of the user
    def __str__(self):
        return f"{self.email} - {self.role}"

# Doctor profile model (linked to User)
class Doctor(models.Model):
    
    # One-to-one relationship with User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    
    # Doctor's specialization
    specialization = models.CharField(max_length=100, default='General Physician')
    
    # Years of experience
    years_of_experience = models.IntegerField(default=0)
    
    # Medical license number
    license_number = models.CharField(max_length=50, blank=True)
    
    # Availability status
    is_available = models.BooleanField(default=True)
    
    # Consultation fee
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)

    # String representation (doctor's name)
    def __str__(self):
        return self.user.full_name

# Signal to automatically create a Doctor profile when a doctor user is created
@receiver(post_save, sender=User)
def create_doctor_profile(sender, instance, created, **kwargs):
    # Check if new user is created and role is doctor
    if created and instance.role == 'doctor':
        # Create doctor profile if not already exists
        Doctor.objects.get_or_create(user=instance)
