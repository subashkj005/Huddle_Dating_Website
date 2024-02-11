from models.models import Post, Comment, User
from marshmallow_mongoengine import ModelSchema
from marshmallow import fields, post_dump


class UserSchema(ModelSchema):
    class Meta:
        model = User
        exclude = ('id', 'following',)

    name = fields.String()
    profile_picture = fields.String()


class CommentSchema(ModelSchema):
    class Meta:
        model = Comment
        exclude = ('active', 'commentor',)

    commentor_name = fields.Function(lambda comment: comment.commentor.name)
    commentor_picture = fields.Function(lambda comment: comment.commentor.profile_picture)
    comment = fields.String()
    commented_time = fields.Function(
        lambda comment: comment.created_at.strftime("%dth %B %Y at %I:%M%p"))


class PostSchema(ModelSchema):
    class Meta:
        model = Post
        exclude = ('is_blocked', 'likes',)

    author = fields.Nested(UserSchema)
    heading = fields.String()
    content = fields.String()
    created_at = fields.DateTime()
    total_likes = fields.Int()
    views = fields.Int()
    comments = fields.Method('filter_active_comments')
 
    def filter_active_comments(self, post):
        active_comments = [comment for comment in post.comments if comment.active]
        print(active_comments, '== active_comments')
        return CommentSchema(many=True).dump(active_comments)
    


