from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('valid/', views.valid, name='valid'),
    path('test/', views.test, name='test')
    ]
