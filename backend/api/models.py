from mongoengine import Document, EmailField, StringField, DateTimeField
import datetime
from django.contrib.auth.hashers import make_password, check_password

class UserProfile(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  
    role = StringField(choices=["admin", "customer"], default="customer")
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {
        'collection': 'user_profile',
        'indexes': ['email']  
    }

    def set_password(self, raw_password):
        
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.email} ({self.role})"