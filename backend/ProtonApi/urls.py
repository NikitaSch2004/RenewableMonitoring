from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('api/get/facilities/', views.get_facilities, name='get_facilities'),
    path('api/add/facility/', views.add_facility, name='add_facility'),
    path('api/populate/facility-data/', views.populate_facility_data, name='populate_facility_data'),
    path('api/get/facility-data/', views.get_facility_data, name='get_facility_data'),
]
