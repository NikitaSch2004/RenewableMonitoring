from django.apps import AppConfig


class ProtonApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ProtonApi'
    def ready(self):
        # Import signal handlers here to ensure they are registered
        from .forecast_scheduler import start_scheduler
        start_scheduler()