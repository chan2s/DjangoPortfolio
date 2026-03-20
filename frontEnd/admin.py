from django.contrib import admin
from .models import Project, Skill, Education, ContactMessage


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'is_featured', 'order', 'created_at')
    list_editable = ('is_featured', 'order')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'description', 'technologies')
    fieldsets = (
        ('Basic Info', {
            'fields': ('title', 'description', 'category', 'technologies', 'order')
        }),
        ('Links', {
            'fields': ('github_url', 'live_url')
        }),
        ('Case Study', {
            'fields': ('problem_statement', 'process_description', 'result_description'),
            'classes': ('collapse',),
        }),
        ('Display', {
            'fields': ('is_featured',)
        }),
    )


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'is_learning', 'order')
    list_editable = ('proficiency', 'order', 'is_learning')
    list_filter = ('category', 'is_learning')
    search_fields = ('name',)


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('institution', 'degree', 'year_start', 'year_end', 'is_current', 'order')
    list_editable = ('order', 'is_current')
    ordering = ('order', 'year_start')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'status', 'submitted_at')
    list_editable = ('status',)
    list_filter = ('status',)
    search_fields = ('full_name', 'email', 'subject', 'message')
    readonly_fields = ('full_name', 'email', 'subject', 'message', 'submitted_at', 'ip_address')

    def has_add_permission(self, request):
        return False  # Messages are created via the contact form only