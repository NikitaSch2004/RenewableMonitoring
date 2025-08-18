from django.urls import path
from . import views

urlpatterns = [
    path('api/login/', views.login, name='login'),
    path('api/me/', views.get_user_profile, name='get_user_profile'),
    path('api/change-password/', views.change_user_password, name='change_user_password'),
    path('api/get/facilities/', views.get_facilities, name='get_facilities'),
    path('api/add/facility/', views.add_facility, name='add_facility'),
    path('api/get/facility-data/', views.get_facility_data, name='get_facility_data'),
    path('api/create/maintenance/', views.create_planned_maintenance, name='create_planned_maintenance'),
    path('api/get/maintenance/', views.get_planned_maintenance, name='get_planned_maintenance'),
    path('api/delete/maintenance/', views.delete_planned_maintenance, name='delete_planned_maintenance'),
    path('api/add/file/', views.add_file, name='add_file'),
    path('api/get/files/', views.get_user_files, name='get_user_files'),
    path('api/admin/register/', views.register, name='admin_register'),
    path('api/admin/get-users/', views.get_all_users, name='admin_get_all_users'),
    path('api/admin/get-facilities/', views.get_all_facilities, name='admin_get_all_facilities'),
    path('api/admin/get-maintenance/', views.get_all_maintenances, name='admin_get_all_maintenances'),
    path('api/admin/get-files/', views.get_all_files, name='admin_get_all_files'),
    #path('api/delete/file/<int:file_id>/', views.delete_file, name='delete_file'),
]
