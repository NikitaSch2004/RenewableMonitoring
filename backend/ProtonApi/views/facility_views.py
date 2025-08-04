from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import Facility
import json
from .auth_utils import jwt_required

"""
Facility Management Views
"""

@csrf_exempt
@require_http_methods(["GET"])
@jwt_required
def get_facilities(request):
    """Get all facilities from database"""
    try:
        facilities = Facility.objects.all()
        facilities_data = [facility.serialize() for facility in facilities]
        
        return JsonResponse({
            "code": 200,
            "message": "Facilities retrieved successfully",
            "facilities": facilities_data
        }, status=200)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error retrieving facilities: {str(e)}"
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@jwt_required
def add_facility(request):
    """
    Add a new facility to the database
    Expected JSON format:
    {
        "name": "Facility Name",
        "status": "active",
        "power": 1000
    }
    """
    try:
        data = json.loads(request.body)
        
        # Create new facility
        facility = Facility.objects.create(
            name=data.get('name'),
            status=data.get('status'),
            power=int(data.get('power')),
        )
        
        return JsonResponse({
            "code": 201,
            "message": "Facility added successfully",
            "facility": facility.serialize()
        }, status=201)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error adding facility: {str(e)}"
        }, status=500)
