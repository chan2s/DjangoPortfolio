from django.urls import path
from . import views

app_name = 'frontEnd'

urlpatterns = [
    path('', views.index, name='index'),
    path('contact/submit/', views.submit_contact, name='submit_contact'),
]