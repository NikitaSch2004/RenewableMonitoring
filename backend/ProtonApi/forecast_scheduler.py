import asyncio
import datetime 
import threading
from .FDReceiver import main
from .models import Facility, ForecastData
from asgiref.sync import sync_to_async


@sync_to_async
def save_forecast_data_to_db(forecast_data):
    """
    Save forecast data to the database.
    Expected format:
    [
        {
            'year': 2025,
            'month': 7,
            'day': 23,
            'data': [
                {
                    'id': '7263011',
                    'type': 'wind',
                    'values': [...]
                },
                ...
            ]
        },
        ...
    ]
    """
    try:
        saved_count = 0

        for day_data in forecast_data:
            forecast_date = datetime.date(day_data['year'], day_data['month'], day_data['day'])

            for facility_data in day_data['data']:
                facility_id = facility_data['id']
                facility_type = facility_data['type']
                hourly_values = facility_data['values']

                try:
                    facility = Facility.objects.get(id=facility_id)

                    forecast_obj, created = ForecastData.objects.update_or_create(
                        facility_id=facility,
                        date=forecast_date,
                        defaults={'hourly_data': hourly_values}
                    )

                    action = "Created" if created else "Updated"
                    print(f"{action} forecast data for facility {facility_id} ({facility_type}) on {forecast_date}")
                    saved_count += 1

                except Facility.DoesNotExist:
                    print(f"Facility with ID {facility_id} does not exist in database")

        print(f"Successfully saved/updated {saved_count} forecast data records")
        return True

    except Exception as e:
        print(f"Error saving forecast data to database: {str(e)}")
        return False


async def do_task():
    try:
        print("Doing task...")
        flag = main()
        if flag and flag.get("status") == "200":
            print("Forecast data received successfully")
            
            # Save forecast data to database
            forecast_data = flag.get("data", [])
            if forecast_data:
                success = await save_forecast_data_to_db(forecast_data)
                if success:
                    print("Forecast data saved to database successfully")
                else:
                    print("Failed to save forecast data to database")
            else:
                print("No forecast data to save")
                
        else:
            print("Error receiving forecast data from API")
        return flag
    except Exception as e:
        print(f"Error in do_task: {str(e)}")
        return False


async def scheduler():
    now = datetime.datetime.now()
    target_time = now.replace(hour=9, minute=0, second=0, microsecond=0)

    if now >= target_time:
        print("Server started after 9 AM running task")
        flag = await do_task()
        if flag and flag.get("status") == "200":
            print("Initial task executed successfully on server startup.")
        else:
            print("Initial task failed. Continuing with scheduled runs.")
    else:
        print("Server started before 9 AM waiting for scheduled execution.")

    while True:
        now = datetime.datetime.now()
        target_time = now.replace(hour=9, minute=0, second=0, microsecond=0)
        if now >= target_time:
            target_time += datetime.timedelta(days=1)

        wait_time = (target_time - now).total_seconds()
        print(f"Waiting for {wait_time} seconds until {target_time}")
        await asyncio.sleep(wait_time)

        while True:
            flag = await do_task()
            if flag["status"] == "200":
                print("Task executed successfully.")
                break
            else:
                print("Task execution failed, retrying in 1 hour...")
                await asyncio.sleep(60)


def start_scheduler():
    def runner():
        asyncio.run(scheduler())
    thread = threading.Thread(target=runner)
    thread.daemon = True
    thread.start()