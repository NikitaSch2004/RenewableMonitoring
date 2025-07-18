from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
#import jwt
from django.conf import settings
from functools import wraps
from django.views.decorators.http import require_http_methods
from .models import User, Facility, ProductionData, ForecastData
from datetime import datetime
import json
import random

"""
TODO: IMPLEMENT JWT TOKEN FOR EVERY REQUEST 
Create and validate JWT tokens for user authentication

JWT_SECRET = getattr(settings, 'JWT_SECRET', 'your_default_secret')
JWT_ALGORITHM = getattr(settings, 'JWT_ALGORITHM', 'HS256')
JWT_EXP_DELTA_SECONDS = getattr(settings, 'JWT_EXP_DELTA_SECONDS' , 3600)
def generate_jwt_token(user):
    import datetime
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def jwt_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        token = request.COOKIES.get('jwt')
        if not token:
            return JsonResponse({'code': 401, 'message': 'Authentication credentials were not provided.'}, status=401)
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            request.user_id = payload['user_id']
            request.user_email = payload['email']
        except jwt.ExpiredSignatureError:
            return JsonResponse({'code': 401, 'message': 'Token has expired.'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'code': 401, 'message': 'Invalid token.'}, status=401)
        return view_func(request, *args, **kwargs)
    return _wrapped_view

"""
""" REGISTER AND LOGIN VIEWS """

@csrf_exempt
#@require_http_methods(["POST"])
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

@csrf_exempt
#@require_http_methods(["POST"])
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
        #Parse request data
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
        
        # Find user with provided email
        user = User.objects.get(email=email)
        
        # Check if password is correct
        if user.check_password(password):
            # Generate JWT token
            #token = generate_jwt_token(user)
            return JsonResponse({
                "code": 200,
                "message": "Login successful",
                "email": user.email,
                "user_id": user.id,
                #"token": token
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
            "message": "User could not be logged in"
        }, status=500)

""" FACILITY VIEWS """

@csrf_exempt
@require_http_methods(["GET"])
#@jwt_required
def get_facilities(request):
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
#@jwt_required
def add_facility(request):
    """
    Add a new facility to the database
    """
    try:
        data = json.loads(request.body)
        
        # new facility
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

""" Populate Facility Data Views AND Get Facility Data Views """

@csrf_exempt
#testing purposes, remove later
#@require_http_methods(["POST"])
#@jwt_required
def populate_facility_data(request):
    production_data = []
    forecast_data = []

    month = random.randint(1, 12)
    day = random.randint(1, 28)
    for facility_id in range(1, 5):  # Facilities 1-4
        # Random month 1-12, random day 1-28(for simplicity)
        date_str = f"2025-{month:02d}-{day:02d}"

        # random hourly data for 24 hours
        production_hourly_data = [random.randint(20, 120) for _ in range(24)]
        forecast_hourly_data = [val + 10 for val in production_hourly_data]

        production_data.append({
            "facility_id": facility_id,
            "date": date_str,
            "hourly_data": production_hourly_data
        })
        forecast_data.append({
            "facility_id": facility_id,
            "date": date_str,
            "hourly_data": forecast_hourly_data
        })

    # Handle both single object and array
    if isinstance(production_data, dict):
        production_data = [production_data]
    if isinstance(forecast_data, dict):
        forecast_data = [forecast_data]

    # Production data
    for item in production_data:
        facility_id = item['facility_id']
        date_str = item['date']
        hourly_data = item['hourly_data']

        facility = Facility.objects.get(id=facility_id)

        ProductionData.objects.update_or_create(
            facility_id=facility,
            date=datetime.strptime(date_str, '%Y-%m-%d').date(),
            defaults={'hourly_data': hourly_data}
        )

    # Forecast data
    for item in forecast_data:
        facility_id = item['facility_id']
        date_str = item['date']
        hourly_data = item['hourly_data']

        facility = Facility.objects.get(id=facility_id)

        ForecastData.objects.update_or_create(
            facility_id=facility,
            date=datetime.strptime(date_str, '%Y-%m-%d').date(),
            defaults={'hourly_data': hourly_data}
        )

    return JsonResponse({
        "code": 200,
        "message": "Data added successfully",
        "production_data": production_data,
        "forecast_data": forecast_data
    }, status=200)


@csrf_exempt
@require_http_methods(["GET"])
#@jwt_required
def get_facility_data(request):
    try:
        mode = request.GET.get('mode', 'day')  # default to 'day'
        date_param = request.GET.get('date')   # for day/month/year filtering
        # To get parameters from JSON body instead of query params, uncomment below:
        # try:
        #     body = json.loads(request.body)
        #     mode = body.get('mode', 'day')
        #     date_param = body.get('date')
        # except Exception:
        #     mode = 'day'
        #     date_param = None
        # Helper to get data for a queryset
        def get_data(queryset, all_facility_ids, mode):
            if mode == 'day':
                hourly_data = {}
                for hour in range(24):
                    hour_key = f"{hour:02d}:00"
                    hourly_data[hour_key] = {}
                    for facility_id in all_facility_ids:
                        hourly_data[hour_key][str(facility_id)] = 0
                for facility_data in queryset:
                    facility_id = str(facility_data.facility_id.id)
                    hourly_values = facility_data.hourly_data
                    for hour in range(24):
                        hour_key = f"{hour:02d}:00"
                        if hour < len(hourly_values):
                            hourly_data[hour_key][facility_id] = hourly_values[hour]
                return hourly_data

            elif mode == 'month':
                days_in_month = {}
                for facility_id in all_facility_ids:
                    days_in_month[str(facility_id)] = {}
                for pd in queryset:
                    day = pd.date.day
                    facility_id = str(pd.facility_id.id)
                    total = sum(pd.hourly_data)
                    days_in_month[facility_id][str(day)] = total
                result = {}
                for day in range(1, 29):  # Assuming 28 days for simplicity
                    day_key = str(day)
                    result[day_key] = {}
                    for facility_id in all_facility_ids:
                        result[day_key][str(facility_id)] = days_in_month[str(facility_id)].get(day_key, 0)
                return result

            elif mode == 'year':
                # Initialize monthly data structure for all facilities
                monthly_data = {}
                month_names = {
                    1: "JAN", 2: "FEB", 3: "MAR", 4: "APR",
                    5: "MAY", 6: "JUN", 7: "JUL", 8: "AUG",
                    9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC"
                }
                
                # Initialize all months with all facilities set to 0
                for month_num in range(1, 13):
                    month_key = month_names[month_num]
                    monthly_data[month_key] = {}
                    for facility_id in all_facility_ids:
                        monthly_data[month_key][str(facility_id)] = 0
                
                # Calculate totals for each month and facility
                for pd in queryset:
                    month = pd.date.month
                    month_key = month_names[month]
                    facility_id = str(pd.facility_id.id)
                    daily_total = sum(pd.hourly_data)
                    monthly_data[month_key][facility_id] += daily_total
                
                return monthly_data

        all_facility_ids = list(Facility.objects.values_list('id', flat=True))

        if mode == 'day':
            if date_param:
                production_qs = ProductionData.objects.filter(date=date_param)
                forecast_qs = ForecastData.objects.filter(date=date_param)
                target_date = date_param
            else:
                latest_date = ProductionData.objects.latest('date').date
                production_qs = ProductionData.objects.filter(date=latest_date)
                forecast_qs = ForecastData.objects.filter(date=latest_date)
                target_date = str(latest_date)

            production_data = get_data(production_qs, all_facility_ids, 'day')
            forecast_data = get_data(forecast_qs, all_facility_ids, 'day')

            return JsonResponse({
                "code": 200,
                "message": "Facility data retrieved successfully",
                "date": target_date,
                "production_data": production_data,
                "forecast_data": forecast_data
            }, status=200)

        elif mode == 'month':
            if date_param:
                year, month, _ = map(int, date_param.split('-'))
            else:
                latest = ProductionData.objects.latest('date').date
                year, month = latest.year, latest.month

            production_qs = ProductionData.objects.filter(date__year=year, date__month=month)
            forecast_qs = ForecastData.objects.filter(date__year=year, date__month=month)

            production_data = get_data(production_qs, all_facility_ids, 'month')
            forecast_data = get_data(forecast_qs, all_facility_ids, 'month')

            return JsonResponse({
                "code": 200,
                "message": "Monthly facility data retrieved successfully",
                "month": f"{year}-{month:02d}",
                "production_data": production_data,
                "forecast_data": forecast_data
            }, status=200)

        elif mode == 'year':
            if date_param:
                year = int(date_param.split('-')[0])
            else:
                latest = ProductionData.objects.latest('date').date
                year = latest.year

            production_qs = ProductionData.objects.filter(date__year=year)
            forecast_qs = ForecastData.objects.filter(date__year=year)

            production_data = get_data(production_qs, all_facility_ids, 'year')
            forecast_data = get_data(forecast_qs, all_facility_ids, 'year')

            return JsonResponse({
                "code": 200,
                "message": "Yearly facility data retrieved successfully",
                "year": str(year),
                "production_data": production_data,
                "forecast_data": forecast_data
            }, status=200)

        else:
            return JsonResponse({
                "code": 400,
                "message": "Invalid mode parameter"
            }, status=400)

    except Exception as e:
        return JsonResponse({
            "code": 500,
            "message": f"Error retrieving facility data: {str(e)}"
        }, status=500)
