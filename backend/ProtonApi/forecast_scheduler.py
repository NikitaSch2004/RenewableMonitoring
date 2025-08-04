import datetime
import threading
import time
from django.db import connection
from .FDReceiver import main
from .models import Facility, ForecastData


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

                    ForecastData.objects.update_or_create(
                        facility_id=facility,
                        date=forecast_date,
                        defaults={'hourly_data': hourly_values}
                    )

                    saved_count += 1

                except Facility.DoesNotExist:
                    print(f"⚠ Facility with ID {facility_id} does not exist in database")

        print(f"✅ Successfully saved/updated {saved_count} forecast data records")
        return True

    except Exception as e:
        print(f"❌ Error saving forecast data to database: {str(e)}")
        return False


def do_task():
    """
    Fetch forecast data and save to DB.
    Returns flag dict or False on error.
    """
    try:
        print("▶ Starting forecast data fetch...")
        flag = main()
        if flag and flag.get("status") == "200":
            print("✔ Forecast data received successfully")

            forecast_data = flag.get("data", [])
            if forecast_data:
                success = save_forecast_data_to_db(forecast_data)
                if success:
                    print("✔ Forecast data saved successfully")
                else:
                    print("❌ Failed to save forecast data to DB")
            else:
                print("⚠ No forecast data to save")
        else:
            print("❌ Error receiving forecast data from API")
        return flag
    except Exception as e:
        print(f"❌ Error in do_task: {str(e)}")
        return False


def scheduler():
    """
    Runs do_task() every day at 9:00 AM with retry if fails.
    """
    now = datetime.datetime.now()
    target_time = now.replace(hour=9, minute=0, second=0, microsecond=0)

    if now >= target_time:
        print("ℹ Server started after 9 AM. Running initial task...")
        flag = do_task()
        if flag and flag.get("status") == "200":
            print("✔ Initial task executed successfully.")
        else:
            print("⚠ Initial task failed. Will continue with scheduled runs.")
    else:
        print("ℹ Server started before 9 AM. Waiting for scheduled execution.")

    while True:
        now = datetime.datetime.now()
        target_time = now.replace(hour=9, minute=0, second=0, microsecond=0)
        if now >= target_time:
            target_time += datetime.timedelta(days=1)

        wait_time = (target_time - now).total_seconds()
        print(f"⏳ Waiting {wait_time} seconds until {target_time}")
        time.sleep(wait_time)

        # Retry logic with exponential backoff
        retry_delay = 60  # start with 1 minute
        while True:
            flag = do_task()
            if flag and flag.get("status") == "200":
                print("✔ Task executed successfully.")
                break
            else:
                print(f"⚠ Task failed, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
                retry_delay = min(retry_delay * 2, 3600)  # max 1 hour


def start_scheduler():
    """
    Starts scheduler in a daemon thread.
    Ensures Django DB connection is re-used properly.
    """
    def runner():
        # Force Django DB connection to initialize in this thread
        connection.ensure_connection()
        scheduler()

    thread = threading.Thread(target=runner, daemon=True)
    thread.start()
