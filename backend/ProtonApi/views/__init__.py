# Import all views to make them available when importing from views
from .auth_utils import get_user_from_token
from .auth_views import register, login
from .facility_views import get_facilities, add_facility
from .data_views import get_facility_data
from .maintenance_views import create_planned_maintenance, get_planned_maintenance, delete_planned_maintenance
from .filelist_views import add_file, get_user_files, delete_file

#list with all view functions
__all__ = [
    'get_user_from_token',
    'register',
    'login',
    'get_facilities',
    'add_facility',
    'get_facility_data',
    'create_planned_maintenance',
    'get_planned_maintenance',
    'delete_planned_maintenance',
    'add_file',
    'get_user_files',
    'delete_file'
]
