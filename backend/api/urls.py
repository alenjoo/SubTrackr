from django.urls import path
from api.views import login_user, register_user,create_plan,get_plan,get_csrf_token,customer_plans,subscribe,get_subscribed_plans,subscribed_users

urlpatterns = [
    path('login/', login_user, name='login_user'),
    path('users/', register_user, name='register_user'),
    path('plans/',create_plan,name='create_plan'),
    path('get-plan/',get_plan,name='get_plan'),
    path('csrf/', get_csrf_token, name='get_csrf'),
    path('customer-plans/', customer_plans, name='customer-plans'),
    path('subscribe/', subscribe, name='subscribe'),
    path('my-subscriptions/', get_subscribed_plans,name='my_plans'),
    path('admin-subscribers/', subscribed_users,name='subscribed_users'),
]
