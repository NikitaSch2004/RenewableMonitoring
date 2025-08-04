from django.urls import path
from . import views

urlpatterns = [
    path('api/register/', views.register, name='register'),
    path('api/login/', views.login, name='login'),
    path('api/get/facilities/', views.get_facilities, name='get_facilities'),
    path('api/add/facility/', views.add_facility, name='add_facility'),
    path('api/get/facility-data/', views.get_facility_data, name='get_facility_data'),
    path('api/create/maintenance/', views.create_planned_maintenance, name='create_planned_maintenance'),
    path('api/get/maintenance/', views.get_planned_maintenance, name='get_planned_maintenance'),
    path('api/delete/maintenance/', views.delete_planned_maintenance, name='delete_planned_maintenance'),
]
