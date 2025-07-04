from django.urls import path
from api.views import login_user, register_user

urlpatterns = [
    path('login/', login_user, name='login_user'),
    path('users/', register_user, name='register_user'),
]
