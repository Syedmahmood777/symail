from django.db import models

class Auth(models.Model):
    id = models.BigAutoField(primary_key=True)        
    email = models.EmailField()                        
    password = models.CharField(max_length=128)       
    date_joined = models.DateTimeField()              

    class Meta:
        managed = False                              
        db_table = 'auth'       

    def __str__(self):
        return self.email
class Info(models.Model):
    id = models.BigAutoField(primary_key=True)  
    email = models.EmailField(max_length=255)
    fname = models.CharField(max_length=30)
    lname = models.CharField(max_length=30)
    country = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    phone = models.BigIntegerField()
    address = models.TextField()      
    pin = models.CharField(max_length=10);                       
    date_joined = models.DateTimeField()              
    dob= models.CharField(max_length=30)    
    class Meta:
        managed = False                              
        db_table = 'info'       

    def __str__(self):
        return self.email
