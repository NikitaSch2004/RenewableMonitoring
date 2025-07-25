from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.postgres.fields import ArrayField
from django.db.models import JSONField

# Create your models here.

class User(models.Model):
    email = models.EmailField(unique=True, max_length=255)
    password = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    
    def set_password(self, raw_password):
        """Hash and set the password."""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Check if the provided password matches the stored hash."""
        return check_password(raw_password, self.password)


class Facility(models.Model):
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=10)
    power = models.IntegerField()

    # serialize data into json format
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status,
            'power': self.power,
        }


class ProductionData(models.Model):
    facility_id = models.ForeignKey(Facility, on_delete=models.CASCADE)
    date = models.DateField()
    hourly_data = JSONField()  


class ForecastData(models.Model):
    facility_id = models.ForeignKey(Facility, on_delete=models.CASCADE)
    hourly_data = JSONField()  
    date = models.DateField()
    