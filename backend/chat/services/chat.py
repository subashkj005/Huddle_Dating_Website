from flask import jsonify
from serializers.serializer import MessageSerializer
from models.models import Room, Message


def create_chat_room(users):
    user1 = users.get('user1', None)
    user2 = users.get('user2', None)

    if user1 and user2:
        room_name = "".join(sorted([user1, user2]))

        try:
            room_exists = Room.objects.filter(room_name=room_name).first()
            if room_exists:
                return jsonify({'message': 'Already Room Exists'}), 400

            room = Room(participants=[user1, user2])
            room.save()
            return jsonify({'message': 'Room created successfully'}), 200

        except Exception as e:
            print('Exception at creating room : ', e)
            return jsonify({'error': 'Error when adding room'}), 400
    else:
        return jsonify({'error': 'Invalid details'}), 400


def add_message_to_room(message):
    sender_id = message.get('sender_id', None)
    chatroom = message.get('chatroom', None)
    content = message.get('content', None)

    if not sender_id or not chatroom or not content:
        return jsonify({'error': "Invalid details"}), 400

    try:
        chatroom_exists = Room.objects.filter(room_name=chatroom).first()
        if not chatroom_exists:
            return jsonify({'error': "Chatroom doesn't exist"}), 404

        if sender_id not in chatroom_exists.participants:
            return jsonify({'error': "Invalid sender id"}), 404

        msg = Message(sender=sender_id,
                    chatroom=chatroom_exists,
                    content=content
                    )
        msg.save()
        return jsonify({'message': "Message added successfully"}), 200
    
    except Exception as e:
        print(f'Exception at adding message : {e}')
        return jsonify({'error': "Error when adding message"}), 400
        
        
def get_chatroom_messages(chatroom_name):
    if not chatroom_name:
        return jsonify({'error': "Invalid data"}), 404
    
    room = Room.objects.filter(room_name=chatroom_name).first()
    if not room:
        return jsonify({'error': "Chatroom doesn't exist"}), 404
    try:
        messages = Message.objects.filter(chatroom=room).order_by('sent_at')
        
        serialized_messages = MessageSerializer().dump(messages, many=True)
        return jsonify({'messages': serialized_messages}),200
    
    except Exception as e:
        print(f"Exception at getting messages: {e}")
        return jsonify({'error': "Error when adding message"}), 400