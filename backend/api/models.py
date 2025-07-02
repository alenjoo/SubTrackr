from mongoengine import Document, EmailField, StringField, DateTimeField
import datetime

class UserProfile(Document):
    email=EmailField(required=True, unique=True)
    stripe_customer_id=StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.utcnow)

    meta={'collection':'user_profile'}
