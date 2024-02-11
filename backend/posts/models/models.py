from datetime import datetime
from mongoengine import Document, StringField, ReferenceField, DateTimeField,\
                        EmbeddedDocument, EmbeddedDocumentField, IntField, EmbeddedDocumentListField,\
                        ListField, BooleanField


class User(Document):
    name = StringField(required=True)
    user_id = StringField(required=True, unique=True) 
    profile_picture = StringField()
    following = ListField(ReferenceField('User'))  
    blocked_users = ListField(ReferenceField('User'))
    

    def follow(self, user):
        if user not in self.following and user not in self.blocked_users:
            self.following.append(user)
            user.save()
            self.save()

    def unfollow(self, user):
        if user in self.following:
            self.following.remove(user)
            user.save()
            self.save()

    def block_user(self, user):
        if user not in self.blocked_users and user in self.following:
            self.blocked_users.append(user)
            self.following.remove(user)
            self.save()

    def unblock_user(self, user):
        if user in self.blocked_users:
            self.blocked_users.remove(user)
            self.save()
  
    
class Like(EmbeddedDocument):
    liker = ReferenceField('User')
    liked_at = DateTimeField(default=datetime.now())
    
    
class Comment(EmbeddedDocument):
    commentor = ReferenceField("User")
    comment = StringField(required=True)
    created_at = DateTimeField(default=datetime.now())
    active = BooleanField(default=True)
    
    
class Post(Document):
    author = ReferenceField(User, required=True)
    content = StringField(required=True)
    heading = StringField()
    created_at = DateTimeField(required=True, default=datetime.now())
    likes = EmbeddedDocumentListField('Like')
    comments = EmbeddedDocumentListField('Comment')
    views = IntField(default=0)
    is_blocked = BooleanField(default=False)
    
    
    @property
    def total_likes(self):
        return int(len(self.likes))
    
    def like(self, user):
        like = Like(liker=user, liked_at=datetime.now())
        self.likes.append(like)
        self.save()

    def unlike(self, user):
        for like in self.likes:
            if like.liker == user:
                self.likes.remove(like)
                self.save()
                return
            
    def get_comment(self, user_comment):
        for each_comment in self.comments:
            if each_comment.comment == user_comment:
                return each_comment
        return None
            
    def add_comment(self, commentor, comment):
        new_comment = Comment(commentor=commentor, comment=comment )
        self.comments.append(new_comment)
        self.save()
        
        
    def delete_comment(self, comment):
        for each_comment in self.comments:
            if each_comment.comment == comment:
                each_comment.active = False
                self.save()
                return
        
        

        
    