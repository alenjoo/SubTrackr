from rest_framework.response import Response
from rest_framework import status
from .models import UserProfile,Plan
from django.contrib.auth import  login
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from django.http import JsonResponse
from mongoengine import DoesNotExist
from django.middleware.csrf import get_token
from bson import ObjectId


@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        
        mongo_user = UserProfile.objects.get(email=email)
        
        if mongo_user.check_password(password):
            
            django_user,created = User.objects.get_or_create(
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

@api_view(['POST'])
def create_plan(request):
    if not request.user.is_authenticated:
        return Response({"message": "Unauthorized"}, status=401)

    user_email = request.user.username 

    name = request.data.get("name")
    price = request.data.get("price")
    interval = request.data.get("interval", "Monthly")
    api_quota = request.data.get("api_quota")
    description = request.data.get("description")

    plan = Plan(
        name=name,
        price=price,
        interval=interval,
        api_quota=api_quota,
        description=description,
        owner_email=user_email  # ✅ Now stored properly
    )
    plan.save()

    return Response({"message": "Plan created successfully"})

@api_view(['GET'])
def get_plan(request):
    user=request.user.username
    plan=Plan.objects(owner_email=user)
    data = [{
        "id": str(p.id),
        "name": p.name,
        "price": float(p.price),
        "interval": p.interval,
        "api_quota": float(p.api_quota),
        "description": p.description
    } for p in plan]
    return Response(data)

@api_view(['GET'])
def customer_plans(request):
    data=Plan.objects()
    plans=[
        {
            "id": str(p.id),
            "name": p.name,
            "price": float(p.price),
            "interval": p.interval,
            "api_quota": float(p.api_quota),
            "description": p.description
        }
        for p in data
    ]

    return Response(plans)

@api_view(['POST'])
def subscribe(request):
    plan_id=request.data.get("plan_id")
    try:
        email=request.user.username
        user=UserProfile.objects(email=email).first()
        plan=Plan.objects(id=plan_id).first()
        if plan in user.subscribed_plans:
            return Response({"message": "Already subscribed to this plan"}, status=400)
        user.subscribed_plans.append(plan)
        user.save()
        return Response({"message": f"Subscribed to {plan.name}"})
    except DoesNotExist:
        return Response({"message": "Plan or user not found"}, status=404)

@api_view(['GET'])
def get_subscribed_plans(request):
    try:
        email = request.user.username
        user = UserProfile.objects.get(email=email)

        plans = user.subscribed_plans  # list of Plan references

        data = [
            {
                "id": str(plan.id),
                "name": plan.name,
                "price": float(plan.price),
                "interval": plan.interval,
                "api_quota": float(plan.api_quota),
                "description": plan.description,
                "owner_email": plan.owner_email
            }
            for plan in plans
        ]

        return Response(data)

    except UserProfile.DoesNotExist:
        return Response({"message": "User not found"}, status=404)

@api_view(['GET'])
def subscribed_users(request):
    admin_email = request.user.username
    owned_plans = Plan.objects(owner_email=admin_email)

    result = []
    for plan in owned_plans:
        users = UserProfile.objects(subscribed_plans__in=[ObjectId(plan.id)])
        result.append({
            "plan_id": str(plan.id),
            "plan_name": plan.name,
            "subscribers": [{"email": user.email} for user in users]
        })

    return Response(result)