from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from django.http import JsonResponse
from mongoengine import DoesNotExist




@api_view(['POST'])

def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        
        mongo_user = UserProfile.objects.get(email=email)
        
        if mongo_user.check_password(password):
            
            django_user, created = User.objects.get_or_create(
                username=email,
                defaults={'password': 'unused'}  
            )
            
            login(request, django_user)
            
            return JsonResponse({
                "message": "Login successful",
                "email": email,
                "role": mongo_user.role
            })
        else:
            return JsonResponse({"message": "Invalid password"}, status=401)
            
    except DoesNotExist:
        return JsonResponse({"message": "User not found"}, status=401)

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

