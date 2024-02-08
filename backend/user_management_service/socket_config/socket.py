import socketio
from socket_config.crud import add_connection, get_connection
from app.logger.config import logger


sio = socketio.AsyncServer(cors_allowed_origins=[], async_mode='asgi')
socket_app = socketio.ASGIApp(sio)


@sio.on("connect")
async def connect(sid, env):
    print('-----------------------------------------')
    print("New Client Connected to This id :"+" "+str(sid))
    print('-----------------------------------------')
    

@sio.on('add_user_connection')
async def add_user_connection(sid, data):
    user_id = data.get('user_id', None)
    sid = sid
    add_connection({'user_id':user_id, 'sid':sid})
    
    
@sio.event
async def match_found(user_id, match):
    socket_connection = await get_connection(user_id)

    if socket_connection:
        await sio.emit('match_found', {'match': match}, to=socket_connection)
    else:
        logger.error("User have currently have no connection")
        
        
        
        
        
