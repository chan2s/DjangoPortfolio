# from django.urls import path
# from . import views

# urlpatterns = [
#     path('main/', views.test, name="test")
# ]

from django.urls import path
# from .views import *
from . import views

urlpatterns = [
  path('' , views.home)
]
