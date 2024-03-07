from config.service_address import USERS_SERVICE, ADMIN_SERVICE,\
                                    POSTS_SERVICE, CHAT_SERVICE


public_services = {
    "public": USERS_SERVICE,
    "admin_auth": ADMIN_SERVICE,
    "user_images": USERS_SERVICE,
    "posts_images": POSTS_SERVICE,
}


protected_services = {
    "users": USERS_SERVICE,
    "chat": CHAT_SERVICE,
    "posts": POSTS_SERVICE,
    
    # Admin
    "admin": ADMIN_SERVICE,
    "admin_access": USERS_SERVICE,
    "admin_post": POSTS_SERVICE,
}


# public_services = {
#     "public": "http://users-service:7614/",
#     "admin_auth": "http://admin-service:8931/",
# }


# protected_services = {
#     "users": "http://users-service:7614/",
#     "chat": "http://chat-service:5236/",
#     "posts": "http://posts-service:9639/",
    
#     # Admin
#     "admin": "http://admin-service:8931/",
#     "admin_access": "http://users-service:7614/",
#     "admin_post": "http://posts-service:9639/",
# }


def get_service_url(service_name):
    return public_services.get(service_name) or protected_services.get(service_name, None)


def is_protected_service(service_name):
    return service_name in protected_services
