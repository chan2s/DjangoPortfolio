from django.db import models


class Project(models.Model):
    CATEGORY_CHOICES = [
        ('web', 'Web App'),
        ('desktop', 'Desktop App'),
        ('mobile', 'Mobile App'),
        ('api', 'API / Backend'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='web')
    technologies = models.CharField(
        max_length=300,
        help_text="Comma-separated list, e.g. Python, Django, MySQL"
    )
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    problem_statement = models.TextField(blank=True)
    process_description = models.TextField(blank=True)
    result_description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0, help_text="Display order (lower = first)")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

    def get_tech_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical Skill'),
        ('professional', 'Professional Skill'),
        ('tool', 'Tool / Environment'),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='technical')
    proficiency = models.PositiveIntegerField(
        default=50,
        help_text="Percentage 0–100 (used for technical skill bars)"
    )
    is_learning = models.BooleanField(default=False)
    description = models.TextField(blank=True, help_text="Used for professional skills")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    year_start = models.CharField(max_length=10)
    year_end = models.CharField(max_length=10, default='Present')
    is_current = models.BooleanField(default=False)
    location = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'year_start']

    def __str__(self):
        return f"{self.institution} ({self.year_start}–{self.year_end})"

    @property
    def year_range(self):
        return f"{self.year_start}–{self.year_end}"


class ContactMessage(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('read', 'Read'),
        ('replied', 'Replied'),
    ]

    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='new')
    submitted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.full_name} — {self.subject} ({self.submitted_at.strftime('%Y-%m-%d')})"