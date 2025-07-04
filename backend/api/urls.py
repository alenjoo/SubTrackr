
from django.urls import path
from api.views import register_user  

urlpatterns = [
    path('users/', register_user, name='register_user'),
]

