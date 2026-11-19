from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .auth_utils import get_user_from_token, jwt_required
import json
from ..models import FileStorage, User
import requests

@csrf_exempt
@jwt_required
@require_http_methods(['POST'])
def add_file(request):
    """
    Add a file to the database.
    {
        name: "Invoice 1",
        type: "pdf",
        size: "2.3 MB",
        date: "18/07/2025",
        link: "https://example.com/invoice1.pdf"
    }
    Note: user_id is automatically extracted from the JWT token
    """
    
    try:
        data = json.loads(request.body)
        user = get_user_from_token(request.headers.get('Authorization'))
        
        # Validate required fields
        required_fields = ['name','type','date','link']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    "code": 400,
                    "message": f"Missing required field: {field}"
                }, status=400)
        
        # Validate filesize is a positive integer
        try:
            filelink = data['link']
            response = requests.head(filelink, allow_redirects=True)
            size = int(response.headers.get('content-length', -1))
        except (ValueError, TypeError):
            return JsonResponse({
                "code": 400,
                "message": "File size must be a positive integer"
            }, status=400)
        
        # Create file record
        file_record = FileStorage.objects.create(
            user_id=user,
            filename=data['name'],
            filetype=data['type'],
            filesize=size,
            filelink=data['link']
        )
        
        return JsonResponse({
            "code": 201,
            "message": "File added successfully",
        }, status=201)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error adding file: {str(e)}"
        }, status=500)


@csrf_exempt
@jwt_required
@require_http_methods(['GET'])
def get_user_files(request):
    """
    Get all files associated with a user.
    Returns a list of files with their details
    """
    
    try:
        user = get_user_from_token(request.headers.get('Authorization'))
        
        # Get all files for the user, ordered by upload date (newest first)
        user_files = FileStorage.objects.filter(user_id=user).order_by('-uploaded_at')
        
        return JsonResponse({
            "code": 200,
            "message": "Files retrieved successfully",
            "files": [file_obj.serialize() for file_obj in user_files],
            "total_files": user_files.count()
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error retrieving files: {str(e)}"
        }, status=500)


'''@csrf_exempt
#@jwt_required
@require_http_methods(['DELETE'])
def delete_file(request, file_id):
    """
    Delete a file from the database.
    URL parameter: file_id (integer)
    """
    
    try:
        # For testing without JWT, get user with ID 1
        # Remove this when JWT is re-enabled
        try:
            user = User.objects.get(id=1)
        except User.DoesNotExist:
            return JsonResponse({
                "code": 404,
                "message": "User not found"
            }, status=404)
        
        # Get the file record
        try:
            file_record = FileStorage.objects.get(id=file_id, user_id=user)
        except FileStorage.DoesNotExist:
            return JsonResponse({
                "code": 404,
                "message": "File not found or you don't have permission to delete it"
            }, status=404)
        
        # Delete the file record
        file_record.delete()
        
        return JsonResponse({
            "code": 200,
            "message": "File deleted successfully"
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error deleting file: {str(e)}"
        }, status=500)'''
