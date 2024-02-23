from flask import jsonify, request
from utils.save_image import save_image
from serializers.serializer import CommentSchema, PostSchema
from models.models import Post, Report, User
from logger.config import logger


def create_or_update_user(user):
    try:
        name = user.get('name', None)
        user_id = user.get('user_id', None)
        profile_picture = user.get('profile_picture', None)
        
        print('name = ', name )
        print('user_id = ', user_id )
        print('profile_picture = ', profile_picture )

        if not user_id:
            return jsonify({'error': 'Invalid details'}), 400
        print('-----1------')
        user_exists = User.objects.filter(user_id=user_id).first()
        
        print('-----2------')
        if user_exists:
            print('-----3------')
            if name:
                user_exists.name = name
            if profile_picture:
                user_exists.profile_picture = profile_picture
            print('-----4------')
            user_exists.save()
            print('-----5------')
            
            logger.info(f"User updated successfully")
            return jsonify({'message': "User updated successfully"})
        
        else:
            print('-----6------')
            user = User(user_id=user_id)
            print('-----7------')
            user.save()
            print('-----8------')
            
            if name:
                user.name = name
            if profile_picture:
                user.profile_picture = profile_picture
            print('-----9------')
            user.save()
            print('-----10------')

            logger.info(f"User created successfully")
            return jsonify({'message': "User created successfully"})
    except Exception as e:
        logger.error(f"Exception at creating or updating user : {e}"), 500
        return jsonify({'error': f"Exception at creating user : {e}"}), 500



def create_post(request):
    user_id = request.form.get('user_id', None)
    content = request.form.get('content', None)
    heading = request.form.get('heading', None)
    image = request.files.get('image', None)
    
    try:
        user = User.objects.filter(user_id=user_id).first()

        if user:
            post_schema = PostSchema()
            if image:
                print('Image true')
                destination, error =save_image(image, user_id)
                
                
                if destination:
                    post = Post(author=user, heading=heading, content=content, image=destination)
                    post.save()
                    created_post = post_schema.dump(post)
                    print('created_post =>', created_post)
                    return jsonify({'message': "Post created", 'created_post' : created_post}), 200 
                    
                elif error:
                    logger.error(f"Post image upload issue : {error}"), 400
                    return jsonify({'file_error': error }), 400
            post = Post(author=user, heading=heading, content=content)
            post.save()
            created_post = post_schema.dump(post)
            return jsonify({'message': "Post created", 'created_post' : created_post}), 200       
        else:
            logger.error(f"User ({user_id}) doesn't exist")
            return jsonify({'error': f"User {user_id} doesn't exist"}), 400

    except Exception as e:
        logger.error(f"Exception at creating post : {e}")
        return jsonify({'error': f"Exception at post creation : {e}"}), 500
    
    
def update_posts(data):
    post_id = data.get('post_id', None)
    
    if not post_id:
        return jsonify({'error': 'Invalid details'}), 400
    
    post = Post.objects.filter(id=post_id).first()
    if not post:
        return jsonify({'error': 'Post not found'}), 404  
    
    
def like_a_post(data):
    liker_id = data.get('liker_id', None)
    post_id = data.get('post_id', None)
    
    if not liker_id or not post_id:
        return jsonify({'error': 'Invalid details'}), 400
    
    post = Post.objects.filter(id=post_id).first()
    user = User.objects.filter(user_id=liker_id).first()
    
    # length = post.count_of_likes()
    
    if not post or not user:
        return jsonify({'error': 'Post or user not found'}), 404
    
    post.like(user)
    return jsonify({'message': f"Post liked"}), 200
    

def dislike_a_post(data):
    liker_id = data.get('liker_id', None)
    post_id = data.get('post_id', None)
    
    if not liker_id or not post_id:
        return jsonify({'error': 'Invalid details'}), 400
    
    post = Post.objects.filter(id=post_id).first()
    user = User.objects.filter(user_id=liker_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not post:
        return jsonify({'error': 'Post not found'}), 404
    
    post.unlike(user)
    return jsonify({'message': f"Post disliked"}), 200


def user_feeds(data, page, items_per_page=10):
    user_id = data.get('user_id', None)
    
    if not user_id:
        return jsonify({'error': 'Invalid details'}), 400
    
    user = User.objects.filter(user_id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    following_users = [str(user.id) for user in user.following]
    
    offset = (page - 1) * items_per_page
    
    posts = Post.objects(author__in=following_users, is_blocked=False).order_by('-created_at')\
            .skip(offset).limit(10)
    
    post_schema = PostSchema()
    serialized_posts = post_schema.dump(posts, many=True)
    
    return serialized_posts


def follow_and_unfollow(data):
    user_id = data.get('user_id', None) # id of the user who wants to follow
    followed_id = data.get('followed_id', None) # id of account which the user wants to follow
    task = data.get('task', None) # To follow= "follow" , to unfollow ="unfollow"
    
    if not user_id or not followed_id or not task:
        return jsonify({'error': 'Invalid details'}), 400
    
    try: 
        user = User.objects.filter(user_id=user_id).first()
        follower = User.objects.filter(user_id=followed_id).first()
        
        if not user or not follower:
            return jsonify({'error': "User or follower doesn't exist"}), 404
        
        if task == "follow":
            user.follow(follower)
            return jsonify({'message': "Followed Successfully"}), 200
        else:
            user.unfollow(follower)
            return jsonify({'message': "Unollowed Successfully"}), 200
            
    except Exception as e:
        logger.error(f"Exception at adding follower: {e}"), 500
        return jsonify({'error': f"Exception at adding follower : {e}"}), 400
    
    
def add_comment(data):
    post_id = data.get('post_id', None)
    user_id = data.get('user_id', None)
    comment = data.get('comment', None)
    
    if not post_id or not user_id or not comment:
        return jsonify({'error': 'Invalid details'}), 400
    
    try:
        user = User.objects.filter(user_id=user_id).first()
        post = Post.objects.filter(id=post_id).first()
        
        if not user or not post:
            return jsonify({'error': "User or Post doesn't exist"}), 404
        
        new_comment_obj = post.add_comment(user, comment)
        comment_schema = CommentSchema()
        new_comment = comment_schema.dump(new_comment_obj)
        return jsonify({'message': "Added new comment Successfully", 'comment': new_comment}), 200
        
    except Exception as e:
        logger.error(f"Exception at adding comment: {e}"), 500
        return jsonify({'error': f"Exception at adding comment : {e}"}), 400
    
    
def delete_comment(data):
    post_id = data.get('post_id', None)
    user_id = data.get('user_id', None)
    comment = data.get('comment', None)
    
    if not post_id or not user_id or not comment:
        return jsonify({'error': 'Invalid details'}), 400
    
    try:
        user = User.objects.filter(user_id=user_id).first()
        post = Post.objects.filter(id=post_id).first()
        
        if not user or not post:
            return jsonify({'error': "User or Post doesn't exist"}), 404
        
        user_comment = post.get_comment(comment)
        print(user_comment, '== user_comment')
        
        if not user_comment:
            return jsonify({'error': "Comment doesn't exist"}), 404
        
        if user_comment.commentor.user_id == user_id:
            post.delete_comment(comment)
            
        else:
            return jsonify({'error': "Comment does not belong to user to delete"}), 400
        
        return jsonify({'message': "Comment deleted Successfully"}), 200
        
    except Exception as e:
        logger.error(f"Exception at adding comment: {e}"), 500
        return jsonify({'error': f"Exception at adding comment : {e}"}), 400
    
    
def register_report(data):
    user_id = data.get('user_id', None)
    post_id = data.get('post_id', None)
    reason = data.get('reason', None)
    
    try:
        if not user_id or not post_id or not reason:
            return jsonify({"error": "Invalid details"}), 400
    
        user = User.objects.filter(user_id=user_id).first()
        post = Post.objects.filter(id=post_id).first()
        
        if not user or not post:
            return jsonify({"error": "User or Post not found"}), 404
        
        report = Report.objects.filter(reported_post=post, reported_by=user).first()
        
        if report:
            return jsonify({"error": "Already reported"}), 400
        
        report = Report(reported_post=post, reported_by=user, reason=reason)
        report.save()
        
        return jsonify({"message": "Report Submitted"}), 200
    except Exception as e:
        logger.error(f"Exception at adding report: {e}")
        return jsonify({"error": "Exception at adding report"}), 500
        
    
    
