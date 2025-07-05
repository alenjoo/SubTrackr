from mongoengine import Document, EmailField, StringField, DateTimeField,DecimalField,ListField,ReferenceField
import datetime
from django.contrib.auth.hashers import make_password, check_password

class UserProfile(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)  
    role = StringField(choices=["admin", "customer"], default="customer")
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    subscribed_plans=ListField(ReferenceField('Plan'))

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

class Plan(Document):
    name=StringField(required=True)
    price=DecimalField(required=True,precision=2)
    interval=StringField(choices=["Monthly","Yearly"],default="Monthly")
    api_quota=DecimalField(required=True,precision=2)
    description=StringField(required=True)
    owner_email=StringField(required=True)

    meta={
        "collection":"plan",
        "index":['name']
    }