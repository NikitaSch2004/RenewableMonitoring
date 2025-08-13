from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .auth_utils import get_user_from_token, jwt_required
import json
from ..models import Facility, PlannedMaintenance

@csrf_exempt
@jwt_required
@require_http_methods(['POST'])
def create_planned_maintenance(request):
    """
    Create a planned maintenance event.
    {
        comment: "string",
        endDate: "YYYY-MM-DD",
        endTime: "HH:MM",
        exp_decrease: "float",
        facility_id: [array of facility IDs or a single facility ID]
        sdate: "YYYY-MM-DD",
        stime: "HH:MM",
    }
    Note: user_id is automatically extracted from the JWT token
    """

    try:
        data = json.loads(request.body)
        
        # Get the JWT token from cookies
        user = get_user_from_token(request.headers.get("Authorization"))
        # Validate required fields
        required_fields = ['comment','endDate','endTime','expectedDecrease','nlc','startDate','startTime']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    "code": 400,
                    "message": f"Missing required field: {field}"
                }, status=400)
        
        # Create planned maintenance event
        maintenance_event = PlannedMaintenance.objects.create(
            user_id=user,
            facility_ids= data['nlc'],
            sdate=data['startDate'],
            stime=data['startTime'],
            edate=data['endDate'],
            etime=data['endTime'],
            exp_decrease=data['expectedDecrease'],
            comments=data['comment']
        )

        return JsonResponse({
            "code": 201,
            "message": "Planned maintenance created successfully",
            "maintenance_event": maintenance_event.serialize()
        }, status=201)
    
    except Exception as e:
        print(str(e))
        return JsonResponse({
            "code": 500,
            "message": f"Error creating planned maintenance: {str(e)}"
        }, status=500)

@csrf_exempt
@jwt_required
@require_http_methods(['GET'])
def get_planned_maintenance(request):
    try:
        user = get_user_from_token(request.headers.get("Authorization"))
        maintenance_events = PlannedMaintenance.objects.filter(user_id=user)
        return JsonResponse({
            "code": 200,
            "maintenance_events": [event.serialize() for event in maintenance_events]
        }, status=200)
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error retrieving planned maintenance: {str(e)}"
        }, status=500)
    

@csrf_exempt
@jwt_required
@require_http_methods(['DELETE'])
def delete_planned_maintenance(request):
    try:
        data = json.loads(request.body)
        maintenance_id = data.get('maintenance_id')
        # Get the planned maintenance event
        maintenance_event = PlannedMaintenance.objects.get(id=maintenance_id)
        maintenance_event.delete()
        
        return JsonResponse({
            "code": 200,
            "message": "Planned maintenance deleted successfully"
        }, status=200)
    
    except PlannedMaintenance.DoesNotExist:
        return JsonResponse({
            "code": 404,
            "message": "Planned maintenance not found"
        }, status=404)
    
    except Exception as e:
        print(str(e))
        return JsonResponse({
            "code": 500,
            "message": f"Error deleting planned maintenance: {str(e)}"
        }, status=500)