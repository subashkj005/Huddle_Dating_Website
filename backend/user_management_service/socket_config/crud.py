
connections = {}


def add_connection(connection):
    user_id = connection.get('user_id', None)
    sid = connection.get('sid', None)
    
    if user_id and sid:
        connections[user_id] = sid
        print('Socket connection added Successfully')
    else:
        print('Unable to add socket connection due to invalid data')
    print('connections = ', connections)
    
    
async def get_connection(user_id):
    socket_connection = connections.get(user_id, None)
    if socket_connection:
        return socket_connection
    else:
        return None
    

        