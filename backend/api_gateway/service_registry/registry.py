PUBLIC_SERVICE = "public-service"
USER_SERVICE = "user-service"


public_services = {
    "public": "http://localhost:7614/",
    "admin_auth": "http://localhost:8931/",
}


protected_services = {
    "users": "http://localhost:7614/",
    "chat": "http://localhost:5236/",
    "posts": "http://localhost:9639/",
    
    # Admin
    "admin": "http://localhost:8931/",
    "admin_access": "http://localhost:7614/",
    "admin_post": "http://localhost:9639/",
}


def get_service_url(service_name):
    return public_services.get(service_name) or protected_services.get(service_name, None)


def is_protected_service(service_name):
    return service_name in protected_services
