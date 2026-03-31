from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class SymptomsAPITest(APITestCase):

    def test_submit_symptoms(self):
        url = reverse('submit-symptoms')
        data = {"symptoms": ["fever", "cough"]}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_symptoms_history(self):
        url = reverse('symptoms-history')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
