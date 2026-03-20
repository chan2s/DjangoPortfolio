from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import render
# Create your views here.
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Project, Skill, Education, ContactMessage
from .forms import ContactForm


def index(request):
    """Main portfolio page — pulls all content from the database."""
    context = {
        'featured_project': Project.objects.filter(is_featured=True).first(),
        'other_projects': Project.objects.filter(is_featured=False),
        'all_projects': Project.objects.all(),  # for the projects count stat
        'technical_skills': Skill.objects.filter(category='technical'),
        'professional_skills': Skill.objects.filter(category='professional'),
        'tools': Skill.objects.filter(category='tool'),
        'education': Education.objects.all(),
        'contact_form': ContactForm(),
    }
    return render(request, 'frontEnd/index.html', context)


@require_POST
def submit_contact(request):
    """Handles the AJAX contact form submission."""
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        data = request.POST

    form = ContactForm(data)
    if form.is_valid():
        message = form.save(commit=False)
        # Capture IP for basic spam tracking
        x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded:
            message.ip_address = x_forwarded.split(',')[0].strip()
        else:
            message.ip_address = request.META.get('REMOTE_ADDR')
        message.save()
        return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
    else:
        return JsonResponse({'success': False, 'errors': form.errors}, status=400)