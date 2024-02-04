from marshmallow_mongoengine import ModelSchema
from models.models import Message


class MessageSerializer(ModelSchema):
    class Meta:
        model = Message
        exclude = ('chatroom',)