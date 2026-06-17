from django.contrib import admin
from django.utils.html import format_html
from .models import (
    ContactSubmission, ServiceCategory, ServiceItem,
    Course, CourseFeature, ResearchArea, TeamMember,
    JobOpening, CareerApplication, Testimonial,
)


# ── Contact ───────────────────────────────────────────────────────────────────

@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'subject_badge', 'status_badge', 'created_at']
    list_filter   = ['status', 'subject', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = ['name', 'email', 'phone', 'subject', 'message', 'ip_address', 'created_at']
    fieldsets = (
        ('Submission', {'fields': ('name', 'email', 'phone', 'subject', 'message', 'ip_address', 'created_at')}),
        ('Admin', {'fields': ('status', 'admin_notes')}),
    )

    def subject_badge(self, obj):
        colors = {
            'general': '#6c63ff', 'software': '#00d4aa',
            'training': '#ff9f43', 'research': '#ee5a24',
            'placement': '#0abde3', 'careers': '#10ac84', 'other': '#576574',
        }
        color = colors.get(obj.subject, '#6c63ff')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            color, obj.get_subject_display()
        )
    subject_badge.short_description = 'Subject'

    def status_badge(self, obj):
        colors = {'new': '#ee5a24', 'in_progress': '#f9ca24', 'resolved': '#6ab04c', 'spam': '#576574'}
        color  = colors.get(obj.status, '#576574')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    actions = ['mark_in_progress', 'mark_resolved', 'mark_spam']

    def mark_in_progress(self, request, qs): qs.update(status='in_progress')
    mark_in_progress.short_description = 'Mark as In Progress'

    def mark_resolved(self, request, qs): qs.update(status='resolved')
    mark_resolved.short_description = 'Mark as Resolved'

    def mark_spam(self, request, qs): qs.update(status='spam')
    mark_spam.short_description = 'Mark as Spam'


# ── Services ──────────────────────────────────────────────────────────────────

class ServiceItemInline(admin.TabularInline):
    model  = ServiceItem
    extra  = 1
    fields = ['name', 'description', 'order', 'is_active']


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display  = ['name', 'tag', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ServiceItemInline]


# ── Courses ───────────────────────────────────────────────────────────────────

class CourseFeatureInline(admin.TabularInline):
    model  = CourseFeature
    extra  = 1
    fields = ['text', 'icon', 'order']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ['title', 'level', 'duration', 'price', 'is_free', 'is_popular', 'is_active', 'order']
    list_filter   = ['level', 'is_popular', 'is_free', 'is_active']
    list_editable = ['is_popular', 'is_active', 'order']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CourseFeatureInline]


# ── Research ──────────────────────────────────────────────────────────────────

@admin.register(ResearchArea)
class ResearchAreaAdmin(admin.ModelAdmin):
    list_display  = ['name', 'style', 'is_active']
    list_editable = ['is_active']


# ── Team ──────────────────────────────────────────────────────────────────────

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display  = ['name', 'designation', 'role', 'order', 'is_active']
    list_filter   = ['role', 'is_active']
    list_editable = ['order', 'is_active']
    search_fields = ['name', 'designation']


# ── Careers ───────────────────────────────────────────────────────────────────

@admin.register(JobOpening)
class JobOpeningAdmin(admin.ModelAdmin):
    list_display  = ['title', 'role', 'type', 'location', 'is_active', 'created_at']
    list_filter   = ['role', 'type', 'is_active']
    list_editable = ['is_active']


@admin.register(CareerApplication)
class CareerApplicationAdmin(admin.ModelAdmin):
    list_display  = ['name', 'email', 'job', 'status_badge', 'created_at']
    list_filter   = ['status', 'created_at']
    search_fields = ['name', 'email']
    readonly_fields = ['name', 'email', 'phone', 'job', 'message', 'resume', 'created_at']

    def status_badge(self, obj):
        colors = {
            'received': '#6c63ff', 'reviewing': '#f9ca24',
            'shortlisted': '#00d4aa', 'rejected': '#ee5a24', 'hired': '#6ab04c',
        }
        color = colors.get(obj.status, '#576574')
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;font-size:11px">{}</span>',
            color, obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    actions = ['shortlist', 'reject', 'mark_hired']

    def shortlist(self, req, qs): qs.update(status='shortlisted')
    shortlist.short_description = 'Shortlist selected'

    def reject(self, req, qs): qs.update(status='rejected')
    reject.short_description = 'Reject selected'

    def mark_hired(self, req, qs): qs.update(status='hired')
    mark_hired.short_description = 'Mark as Hired'


# ── Testimonials ──────────────────────────────────────────────────────────────

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display  = ['name', 'designation', 'type', 'rating', 'is_active', 'created_at']
    list_filter   = ['type', 'rating', 'is_active']
    list_editable = ['is_active']
    search_fields = ['name', 'content']
