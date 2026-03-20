from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['full_name', 'email', 'subject', 'message']
        widgets = {
            'full_name': forms.TextInput(attrs={
                'placeholder': 'Your name',
                'id': 'name',
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'you@email.com',
                'id': 'email',
            }),
            'subject': forms.Select(attrs={
                'id': 'subject',
            }),
            'message': forms.Textarea(attrs={
                'rows': 5,
                'placeholder': 'Tell me about your project or idea...',
                'id': 'message',
            }),
        }

    SUBJECT_CHOICES = [
        ('', 'Select a topic...'),
        ('Internship Opportunity', 'Internship Opportunity'),
        ('Project Collaboration', 'Project Collaboration'),
        ('Freelance Work', 'Freelance Work'),
        ('Just Saying Hi', 'Just Saying Hi'),
    ]

    subject = forms.ChoiceField(
        choices=SUBJECT_CHOICES,
        widget=forms.Select(attrs={'id': 'subject'}),
    )