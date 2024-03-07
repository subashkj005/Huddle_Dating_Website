import os


USERS_SERVICE=os.environ.get('USERS_SERVICE', 'users_address')
ADMIN_SERVICE=os.environ.get('ADMIN_SERVICE', 'admin_address')
POSTS_SERVICE=os.environ.get('POSTS_SERVICE', 'posts_address')
CHAT_SERVICE=os.environ.get('CHAT_SERVICE', 'chat_address')