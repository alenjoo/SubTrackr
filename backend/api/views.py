from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User

class SessionLoginView(APIView):
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful", "email": user.email})
        return Response({"error": "Invalid credentials"}, status=401)

class SessionLogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import UserProfile



from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import UserProfile

@api_view(['POST'])
def register_user(request):
    email = request.data.get("email")
    raw_password = request.data.get("password")
    role = request.data.get("role", "customer")

    if not all([email, raw_password]):
        return Response({"message": "Missing required fields"}, status=400)

    if UserProfile.objects(email=email).first():
        return Response({"message": "User already exists"}, status=400)

    user = UserProfile(email=email, role=role)
    user.set_password(raw_password)
    user.save()

    return Response({
        "message": "User registered successfully",
        "email": user.email,
        "role": user.role
    })

