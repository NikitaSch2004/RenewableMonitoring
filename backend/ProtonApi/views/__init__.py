# Import all views to make them available when importing from views
#from .auth_views import register, login
from .facility_views import get_facilities, add_facility
from .data_views import get_facility_data

#list with all view functions
__all__ = [
    #'register',
    #'login',
    'get_facilities',
    'add_facility',
    'get_facility_data',
    ]
