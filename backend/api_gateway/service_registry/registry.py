PUBLIC_SERVICE = "public-service"
USER_SERVICE = "user-service"


public_services = {
    "public": "http://34.31.212.173:7614/",
    "admin_auth": "http://35.223.178.123:8931/",
}


protected_services = {
    "users": "http://34.31.212.173:7614/",
    "chat": "http://34.122.10.212:5236/",
    "posts": "http://35.193.63.12:9639/",
    
    # Admin
    "admin": "http://35.223.178.123:8931/",
    "admin_access": "http://34.31.212.173:7614/",
    "admin_post": "http://35.193.63.12:9639/",
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
