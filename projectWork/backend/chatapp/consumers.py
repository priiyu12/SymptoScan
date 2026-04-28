import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from consultations.models import Consultation
from .models import Message
from accounts.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.consultation_id = self.scope['url_route']['kwargs']['consultation_id']
        self.room_group_name = f'chat_{self.consultation_id}'

        self.user = await self.get_user_from_token()

        if not self.user:
            await self.close()
            return

        allowed = await self.is_user_allowed()
        if not allowed:
            await self.close()
            return

        accepted = await self.is_consultation_accepted()
        if not accepted:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '').strip()

        if not message:
            return

        saved_message = await self.save_message(message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': saved_message.id,
                'message': saved_message.content,
                'sender': saved_message.sender.id,
                'sender_name': saved_message.sender.full_name,
                'sender_role': saved_message.sender.role,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'id': event['id'],
            'sender': event['sender'],
            'message': event['message'],
            'sender_name': event['sender_name'],
            'sender_role': event['sender_role'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def get_user_from_token(self):
        try:
            query_string = self.scope['query_string'].decode()
            query_params = parse_qs(query_string)
            token = query_params.get('token', [None])[0]

            if not token:
                return None

            access_token = AccessToken(token)
            user_id = access_token['user_id']
            return User.objects.get(id=user_id)
        except Exception:
            return None

    @database_sync_to_async
    def is_user_allowed(self):
        try:
            consultation = Consultation.objects.select_related('doctor__user', 'patient').get(id=self.consultation_id)
            return consultation.patient == self.user or consultation.doctor.user == self.user
        except Consultation.DoesNotExist:
            return False

    @database_sync_to_async
    def is_consultation_accepted(self):
        try:
            consultation = Consultation.objects.get(id=self.consultation_id)
            return consultation.status == 'accepted'
        except Consultation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, message_text):
        consultation = Consultation.objects.get(id=self.consultation_id)
        return Message.objects.create(
            consultation=consultation,
            sender=self.user,
            content=message_text
        )