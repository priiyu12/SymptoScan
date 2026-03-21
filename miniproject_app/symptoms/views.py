# symptoms/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class SubmitSymptomsView(APIView):
    def post(self, request):
        return Response({"message": "Submit symptoms endpoint working!"}, status=status.HTTP_200_OK)

class SymptomHistoryView(APIView):
    def get(self, request):
        return Response({"message": "Symptom history endpoint working!"}, status=status.HTTP_200_OK)
