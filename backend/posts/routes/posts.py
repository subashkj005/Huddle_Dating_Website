from flask import Blueprint, request
from services.posts import delete_comment, follow_and_unfollow, create_post, \
                            create_or_update_user, dislike_a_post, like_a_post, register_report, \
                            user_feeds, add_comment


post_route = Blueprint('posts', __name__)


@post_route.post('/create_post')
def create_new_post():
    return create_post(request) 


@post_route.post('/create_user')
def create_new_user():
    post = request.get_json()
    return create_or_update_user(post)


@post_route.post('/like_post')
def like_post():
    data = request.get_json()
    return like_a_post(data)


@post_route.post('/dislike_post')
def dislike_post():
    data = request.get_json()
    return dislike_a_post(data)


@post_route.post('/get_feeds/<string:page>')
def get_user_feeds(page):
    data = request.get_json()
    return user_feeds(data=data, page=int(page))


@post_route.post('/follow_user')
def follow_user():
    data = request.get_json()
    return follow_and_unfollow(data)


@post_route.post('/add_comment')
def add_new_comment():
    data = request.get_json()
    return add_comment(data)


@post_route.post('/delete_comment')
def delete_a_comment():
    data = request.get_json()
    return delete_comment(data)


@post_route.post('/register_report')
def register_post_report():
    data = request.get_json()
    return register_report(data)















