from rest_framework import generics, permissions
from .models import Feedback
from .serializers import FeedbackSerializer

# For both patients and doctors to submit feedback
class SubmitFeedbackView(generics.CreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(user=user, role=user.role)

# Admin to view all patient feedback
class PatientFeedbackListView(generics.ListAPIView):
    queryset = Feedback.objects.filter(role='patient').order_by('-created_at')
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAdminUser]

# Admin to view all doctor feedback
class DoctorFeedbackListView(generics.ListAPIView):
    queryset = Feedback.objects.filter(role='doctor').order_by('-created_at')
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAdminUser]
