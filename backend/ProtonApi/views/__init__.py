# Import all views to make them available when importing from views
from .auth_utils import get_user_from_token, get_user_profile
from .auth_views import change_user_password, login
from .facility_views import get_facilities, add_facility
from .data_views import get_facility_data
from .maintenance_views import create_planned_maintenance, get_planned_maintenance, delete_planned_maintenance
from .filelist_views import add_file, get_user_files#, delete_file
from .admin_views import register,get_all_users, get_all_facilities, get_all_maintenances, get_all_files

#list with all view functions
__all__ = [
    'get_user_from_token',
    'get_user_profile',
    'register',
    'login',
    'change_user_password',
    'get_facilities',
    'add_facility',
    'get_facility_data',
    'create_planned_maintenance',
    'get_planned_maintenance',
    'delete_planned_maintenance',
    'add_file',
    'get_user_files',
    'register',
    'get_all_users',
    'get_all_facilities',
    'get_all_maintenances',
    'get_all_files',
    #'delete_file'
]
