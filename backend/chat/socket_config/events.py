from flask import request
from datetime import datetime
from flask_socketio import SocketIO, join_room, leave_room, send
from config.settings import get_settings
from logger.config import logger

settings = get_settings()

sio = SocketIO(cors_allowed_origins=[
               settings.FRONTEND_HOST, settings.FRONTEND_HOST_ADDRESS], async_mode="threading")

active_connections = {}
rooms = {}


@sio.on('connect')
async def handle_connect():
    logger.info(f"Event received on namespace: {request.namespace}")
    await sio.emit("connect",{"data":f"id: {request.sid} is connected"})
    logger.info(f'Client {request.sid} : Connected at {datetime.now()}')
    logger.info(f"Active Connections at connect : {active_connections}")
    

@sio.on('add_user_connection')
def add_connection(data):
    user_id = data.get('user_id')
    socket_id = request.sid
    active_connections[user_id] = socket_id
    logger.info('New Connection Added')
    logger.info(f"Active Connections : {active_connections}")
    
    
@sio.on('join_room')
def handle_join_room(data):
    room_name = data['room_name']
    user_id = data['user_id']
    socket_id = active_connections.get(user_id, None)
    if socket_id:
        join_room(room_name)
        if room_name not in rooms:
            rooms[room_name] = [socket_id]
        else:
            rooms[room_name].append(socket_id)
        logger.info(f"User ({user_id}) ADDED to room {room_name}")
        logger.info(f"Rooms : {rooms}")
    else:
        logger.error(f"No active connections for joining room")
        
        
@sio.on('leave_room')
def handle_leave_room(data):
    room_name = data['room_name']
    user_id = data['user_id']
    socket_id = active_connections.get(user_id)
    if socket_id:
        leave_room(room_name)
        if room_name in rooms and socket_id in rooms[room_name]:
            rooms[room_name].remove(socket_id)
            logger.error(f"User ({user_id}) LEFT room {room_name}")
            
            
@sio.on('send_message')
def handle_send_message(data):
    message = data['message']
    room_name = message.get('chatroom')
    if room_name:
        if room_name in rooms:
            sio.emit('recieve_message', {'message':message}, to=room_name)
            
            
@sio.on('is_typing')
def handle_is_typing(data):
    logger.info('Calling is_typing')
    owner = data['owner']
    room_name = data['room_name']
    sio.emit('set_typing', {'owner': owner}, to=room_name)

 
@sio.on('finished_typing')
def handle_is_typing(data):
    logger.info('Calling finished_typing')
    owner = data['owner']
    room_name = data['room_name']
    sio.emit('reset_typing', {'owner': owner}, to=room_name)
 