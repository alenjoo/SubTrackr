from django.urls import path
from api.views import login_user, register_user,create_plan,get_plan

urlpatterns = [
    path('login/', login_user, name='login_user'),
    path('users/', register_user, name='register_user'),
    path('plans/',create_plan,name='create_plan'),
    path('get-plan/',get_plan,name='get_plan'),
]
