from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import User
import json
from .auth_utils import generate_jwt_token, jwt_required, get_user_from_token

"""
Authentication Views - Register and Login
"""


@csrf_exempt
@jwt_required
@require_http_methods(["POST"])
def change_user_password(request):
    user = get_user_from_token(request.headers.get('Authorization'))
    try:
        request_data = json.loads(request.body.decode('utf-8'))
        old_password = request_data.get('old_password')
        new_password = request_data.get('new_password')

        if not old_password:
            return JsonResponse({
                "code": 500,
                "message": "Old password is required"
            }, status=500)

        if not user.check_password(old_password):
            return JsonResponse({
                "code": 500,
                "message": "Old password is incorrect"
            }, status=500)

        if not new_password:
            return JsonResponse({
                "code": 500,
                "message": "New password is required"
            }, status=500)

        user.set_password(new_password)
        user.save()

        return JsonResponse({
            "code": 200,
            "message": "Password changed successfully"
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({
            "code": 500,
            "message": "Invalid JSON data"
        }, status=500)

    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error changing password: {str(e)}"
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    """
    Login user with email and password from request body
    Expected JSON format:
    {
        "email": "user@example.com",
        "password": "password123"
    }
    """
    try:
        # Parse request data
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

        # Find user with provided email
        user = User.objects.get(email=email)

        # Check if password is correct
        if user.check_password(password):
            # Generate JWT token
            token = generate_jwt_token(user)
            return JsonResponse({
                "code": 200,
                "message": "Login successful",
                "email": user.email,
                "user_id": user.id,
                'is_superuser': user.is_superuser,
                "token": token
            }, status=200)
        else:
            return JsonResponse({
                "code": 500,
                "message": "Invalid credentials"
            }, status=500)

    except User.DoesNotExist:
        return JsonResponse({
            "code": 500,
            "message": "User does not exist"
        }, status=500)

    except json.JSONDecodeError:
        return JsonResponse({
            "code": 500,
            "message": "Invalid JSON data"
        }, status=500)

    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"User could not be logged in Error: {str(e)}"
        }, status=500)
