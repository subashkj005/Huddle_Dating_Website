from flask import Blueprint, request


admin_route = Blueprint('admin_route', __name__)


@admin_route.get('/')
def checking():
    return {'msg': 'working'}
