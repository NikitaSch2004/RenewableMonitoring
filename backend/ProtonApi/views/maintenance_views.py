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
        token: <JWT_TOKEN> localstorage (automatically extracted from Authorization header)
        sdate: 
        stime:
        edate:
        etime:
        exp_decrease:
        facility_id: <ID of the facility> NLC
        comments: <Comments for the maintenance>
    }
    Note: user_id is automatically extracted from the JWT token
    """

    try:
        data = json.loads(request.body)
        
        # Get the JWT token from cookies
        user = get_user_from_token(['user_id'])
        # Validate required fields
        required_fields = ['sdate', 'stime', 'edate', 'etime', 'exp_decrease', 'facility_id']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    "code": 400,
                    "message": f"Missing required field: {field}"
                }, status=400)
        
        # Validate facility exists
        try:
            facility = Facility.objects.get(id=data['facility_id'])
        except Facility.DoesNotExist:
            return JsonResponse({
                "code": 400,
                "message": "Facility not found"
            }, status=400)
        
        # Create planned maintenance event
        maintenance_event = PlannedMaintenance.objects.create(
            user_id=user,
            sdate=data['sdate'],
            stime=data['stime'],
            edate=data['edate'],
            etime=data['etime'],
            exp_decrease=data['exp_decrease'],
            facility_id=facility,
            comments=data.get('comments', '')
        )
        
        return JsonResponse({
            "code": 201,
            "message": "Planned maintenance created successfully",
            "maintenance_event": maintenance_event.serialize()
        }, status=201)
    
    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error creating planned maintenance: {str(e)}"
        }, status=500)

@csrf_exempt
@jwt_required
@require_http_methods(['GET'])
def get_planned_maintenance(request):
    try:
        user = get_user_from_token(['user_id'])

        # Get planned maintenance events for the facility
        facility_id = request.GET.get('facility_id')
        maintenance_events = PlannedMaintenance.objects.filter(user_id=user, facility_id=facility_id)
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
@require_http_methods(['POST'])
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
        return JsonResponse({
            "code": 500,
            "message": f"Error deleting planned maintenance: {str(e)}"
        }, status=500)