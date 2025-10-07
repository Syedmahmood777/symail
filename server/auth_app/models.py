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
