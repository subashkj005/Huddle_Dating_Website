from datetime import datetime
from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField


class Room(Document):
    room_name = StringField(required=True)
    participants = ListField(max_length=2)
    created_at = DateTimeField(default=datetime.utcnow)
    
    def save(self, *args, **kwargs):
        self.room_name = "".join(sorted([participant for participant in self.participants]))
        super().save(*args, **kwargs)
    

class Message(Document):
    sender = StringField(required=True)
    chatroom = ReferenceField(Room, required=True)
    content = StringField(required=True)
    sent_at = DateTimeField(default=datetime.utcnow)
    
    