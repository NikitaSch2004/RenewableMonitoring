"""
FacilityData management views
Get_facility_data- sends through GET request data to the frontend
- mode: 'day', 'month', 'year' (default: 'day')
- date: date string for filtering (optional yyyy-mm-dd format)

TODO:Change from 28 days to dinamic days gathering
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import Facility, ProductionData, ForecastData
import calendar
from datetime import datetime

@csrf_exempt
@require_http_methods(["GET"])
#@jwt_required
def get_facility_data(request):
    try:
        mode = request.GET.get('mode', 'day')  
        date_param = request.GET.get('date')  

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
                date_str = request.GET.get('date')
                if date_str:
                    year, month, _ = map(int, date_str.split('-'))
                else:
                    now = datetime.now()
                    year, month = now.year, now.month

                num_days = calendar.monthrange(year, month)[1]

                days_in_month = {}
                for facility_id in all_facility_ids:
                    days_in_month[str(facility_id)] = {}
                for pd in queryset:
                    day = pd.date.day
                    facility_id = str(pd.facility_id.id)
                    total = sum(pd.hourly_data)
                    days_in_month[facility_id][str(day)] = total
                result = {}
                for day in range(1, num_days + 1):
                    day_key = str(day)
                    result[day_key] = {}
                    for facility_id in all_facility_ids:
                        result[day_key][str(facility_id)] = days_in_month[str(facility_id)].get(day_key, 0)
                return result
            elif mode == 'year':
                monthly_data = {}
                month_names = {
                    1: "1", 2: "2", 3: "3", 4: "4",
                    5: "5", 6: "6", 7: "7", 8: "8", 
                    9: "9", 10: "10", 11: "11", 12: "12"
                }
                
                for month_num in range(1, 13):
                    month_key = month_names[month_num]
                    monthly_data[month_key] = {}
                    for facility_id in all_facility_ids:
                        monthly_data[month_key][str(facility_id)] = 0
                
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
