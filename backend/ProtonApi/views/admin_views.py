from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .auth_utils import get_user_from_token, jwt_required
from ..models import Facility, User, PlannedMaintenance, FileStorage
import json

@csrf_exempt
@jwt_required
@require_http_methods(["POST"])
def register(request):
    """
    Register a new user with email and password from request body
    Expected JSON format:
    {
        "email": "user@example.com",
        "password": "123"
    }
    """
    admin = get_user_from_token(request.headers.get('Authorization'))
    if admin.is_superuser:
        try:
            request_data = json.loads(request.body.decode('utf-8'))

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
                "message": f"User could not be added. Error: {str(e)}"
            }, status=500)

    else:
        return JsonResponse({
            "code": 403,
            "message": "Admin access required"
        }, status=403)
    

@csrf_exempt    
@jwt_required
def get_all_users(request):
    admin = get_user_from_token(request.headers.get('Authorization'))
    if admin.is_superuser:
        users = User.objects.all()
        return JsonResponse({
            "code": 200,
            "data": list(users)
        }, status=200)
    else:
        return JsonResponse({
            "code": 403,
            "message": "Admin access required"
        }, status=403)
    
@csrf_exempt
@jwt_required
def get_all_facilities(request):
    admin = get_user_from_token(request.headers.get('Authorization'))
    if admin.is_superuser:
        facilities = Facility.objects.all()
        return JsonResponse({
            "code": 200,
            "data": list(facilities)
        }, status=200)
    else:
        return JsonResponse({
            "code": 403,
            "message": "Admin access required"
        }, status=403)
    
@csrf_exempt
@jwt_required
def get_all_maintenances(request):
    admin = get_user_from_token(request.headers.get('Authorization'))
    if admin.is_superuser:
        maintenances = PlannedMaintenance.objects.all()
        return JsonResponse({
            "code": 200,
            "data": list(maintenances)
        }, status=200)
    else:
        return JsonResponse({
            "code": 403,
            "message": "Admin access required"
        }, status=403)

@csrf_exempt
@jwt_required
def get_all_files(request):
    admin = get_user_from_token(request.headers.get('Authorization'))
    if admin.is_superuser:
        files = FileStorage.objects.all()
        return JsonResponse({
            "code": 200,
            "data": list(files)
        }, status=200)
    else:
        return JsonResponse({
            "code": 403,
            "message": "Admin access required"
        }, status=403)