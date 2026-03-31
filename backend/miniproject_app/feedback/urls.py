from django.urls import path
from .views import SubmitFeedbackView, PatientFeedbackListView, DoctorFeedbackListView

urlpatterns = [
    path('submit/', SubmitFeedbackView.as_view(), name='submit_feedback'),
    path('patient-feedback/', PatientFeedbackListView.as_view(), name='patient_feedback'),
    path('doctor-feedback/', DoctorFeedbackListView.as_view(), name='doctor_feedback'),
]
