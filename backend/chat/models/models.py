from datetime import datetime, timedelta
from mongoengine import Document, StringField, ListField, ReferenceField, DateTimeField


class Room(Document):
    room_name = StringField(required=True)
    participants = ListField(max_length=2)
    created_at = DateTimeField(default=datetime.utcnow)
    expiry = DateTimeField(default=lambda: datetime.now() + timedelta(days=2))

    def save(self, *args, **kwargs):
        self.room_name = "".join(
            sorted([participant for participant in self.participants]))
        super().save(*args, **kwargs)
        
    @property
    def is_expired(self):
        return datetime.now() >= self.expiry


class Message(Document):
    sender_id = StringField(required=True)
    chatroom = ReferenceField(Room, required=True)
    content = StringField(required=True)
    sent_at = DateTimeField(default=datetime.utcnow)
