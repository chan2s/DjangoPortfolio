from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

def home(request):
    return render(request,"frontEnd/Index.html")