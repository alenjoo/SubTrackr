from mongoengine import Document, EmailField, StringField, DateTimeField
import datetime
from django.contrib.auth.hashers import make_password

class UserProfile(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  # Hashed password
    role = StringField(choices=["admin", "customer"], default="customer")
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta = {'collection': 'user_profile'}

    def set_password(self, raw_password):
        self.password = make_password(raw_password)
