from flask import Blueprint, jsonify, request
from services.chat import create_chat_room, \
                        add_message_to_room, \
                        get_chatroom_messages

chat_route = Blueprint('routes', __name__)

@chat_route.post('/create_room')
def create_room():
    users = request.get_json()
    if users:
        return create_chat_room(users)
    return jsonify({'error': "Invalid data"})


@chat_route.post('/add_message')
def add_message():
    message = request.get_json()
    if message:
        return add_message_to_room(message)
    return jsonify({'error': "Invalid data"})


@chat_route.get('/get_messages/<string:chatroom_name>')
def get_messages(chatroom_name):
    return get_chatroom_messages(chatroom_name)

    
