from django.apps import AppConfig
import os


class ProtonApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ProtonApi'
    def ready(self):
        if os.environ.get('RUN_MAIN') != 'true':  # Avoid running on every reload in development
            return

        from .forecast_scheduler import start_scheduler
        start_scheduler()