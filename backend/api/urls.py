from django.urls import path
from .views import UserProfileListCreateView

urlpatterns = [
    path("users/", UserProfileListCreateView.as_view(), name="user-list-create"),
]
