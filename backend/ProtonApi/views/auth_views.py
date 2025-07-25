from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import User
import json
#from .auth_utils import generate_jwt_token

"""
Authentication Views - Register and Login
"""

@csrf_exempt
def register(request):
    """
    Register a new user with email and password from request body
    Expected JSON format:
    {
        "email": "user@example.com",
        "password": "123"
    }
    """
    try:
        request_data = json.loads(request.body)
        
        # Extract email and password from request
        email = request_data.get('email')
        password = request_data.get('password')

        # Validation
        if not email:
            return JsonResponse({
                "code": 500,
                "message": "Email is required"
            }, status=500)
        
        if not password:
            return JsonResponse({
                "code": 500,
                "message": "Password is required"
            }, status=500)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return JsonResponse({
                "code": 500,
                "message": "User already exists"
            }, status=500)
        
        # Create new user
        user = User(email=email)
        user.set_password(password)
        user.save()
        
        return JsonResponse({
            "code": 200,
            "message": "User has registered successfully"
        }, status=200)
    
    except json.JSONDecodeError:
        return JsonResponse({
            "code": 500,
            "message": "Invalid JSON data"
        }, status=500)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": "User could not be added"
        }, status=500)

# @csrf_exempt
# def login(request):
#     """
#     Login user with email and password from request body
#     Expected JSON format:
#     {
#         "email": "user@example.com",
#         "password": "password123"
#     }
#     """
#     try:
#         # Parse request data
#         request_data = json.loads(request.body)
#
#         # Extract email and password from request
#         email = request_data.get('email')
#         password = request_data.get('password')
#
#         # Validation
#         if not email:
#             return JsonResponse({
#                 "code": 500,
#                 "message": "Email is required"
#             }, status=500)
#
#         if not password:
#             return JsonResponse({
#                 "code": 500,
#                 "message": "Password is required"
#             }, status=500)
#
#         # Find user with provided email
#         user = User.objects.get(email=email)
#
#         # Check if password is correct
#         if user.check_password(password):
#             # Generate JWT token
#             token = generate_jwt_token(user)
#             return JsonResponse({
#                 "code": 200,
#                 "message": "Login successful",
#                 "email": user.email,
#                 "user_id": user.id,
#                 "token": token
#             }, status=200)
#         else:
#             return JsonResponse({
#                 "code": 500,
#                 "message": "Invalid credentials"
#             }, status=500)
#
#     except User.DoesNotExist:
#         return JsonResponse({
#             "code": 500,
#             "message": "User does not exist"
#         }, status=500)
#
#     except json.JSONDecodeError:
#         return JsonResponse({
#             "code": 500,
#             "message": "Invalid JSON data"
#         }, status=500)
#
#     except Exception as e:
#         return JsonResponse({
#             "code": 500,
#             "message": "User could not be logged in"
#         }, status=500)
