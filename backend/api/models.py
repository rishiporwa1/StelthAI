from django.db import models
from django.contrib.auth.models import User


# ── Contact ───────────────────────────────────────────────────────────────────

class ContactSubmission(models.Model):
    STATUS_CHOICES = [
        ('new',         'New'),
        ('in_progress', 'In Progress'),
        ('resolved',    'Resolved'),
        ('spam',        'Spam'),
    ]
    SUBJECT_CHOICES = [
        ('general',     'General Inquiry'),
        ('software',    'Software Development'),
        ('training',    'Training Programs'),
        ('research',    'Research Collaboration'),
        ('placement',   'Internship / Placement'),
        ('careers',     'Careers'),
        ('other',       'Other'),
    ]

    name        = models.CharField(max_length=150)
    email       = models.EmailField()
    phone       = models.CharField(max_length=20, blank=True)
    subject     = models.CharField(max_length=30, choices=SUBJECT_CHOICES, default='general')
    message     = models.TextField()
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    admin_notes = models.TextField(blank=True)
    ip_address  = models.GenericIPAddressField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'

    def __str__(self):
        return f"{self.name} — {self.get_subject_display()} ({self.created_at.strftime('%d %b %Y')})"


# ── Services ──────────────────────────────────────────────────────────────────

class ServiceCategory(models.Model):
    name        = models.CharField(max_length=100)
    slug        = models.SlugField(unique=True)
    tag         = models.CharField(max_length=20, help_text='Short tag shown in UI, e.g. CORE')
    description = models.TextField(blank=True)
    icon        = models.CharField(max_length=10, blank=True, help_text='Emoji icon')
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Service Categories'

    def __str__(self):
        return self.name


class ServiceItem(models.Model):
    category    = models.ForeignKey(ServiceCategory, related_name='items', on_delete=models.CASCADE)
    name        = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    order       = models.PositiveIntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.category.name} › {self.name}"


# ── Training ──────────────────────────────────────────────────────────────────

class Course(models.Model):
    LEVEL_CHOICES = [
        ('beginner',      'Beginner'),
        ('intermediate',  'Intermediate'),
        ('advanced',      'Advanced'),
    ]

    title        = models.CharField(max_length=200)
    slug         = models.SlugField(unique=True)
    description  = models.TextField()
    level        = models.CharField(max_length=15, choices=LEVEL_CHOICES, default='beginner')
    duration     = models.CharField(max_length=50, help_text='e.g. 8 weeks, 3 months')
    price        = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    is_free      = models.BooleanField(default=False)
    is_popular   = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=True)
    icon         = models.CharField(max_length=10, blank=True)
    order        = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class CourseFeature(models.Model):
    course      = models.ForeignKey(Course, related_name='features', on_delete=models.CASCADE)
    text        = models.CharField(max_length=200)
    icon        = models.CharField(max_length=10, blank=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} › {self.text}"


# ── Research ──────────────────────────────────────────────────────────────────

class ResearchArea(models.Model):
    STYLE_CHOICES = [('a', 'Purple'), ('b', 'Teal'), ('c', 'Red')]

    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    style       = models.CharField(max_length=1, choices=STYLE_CHOICES, default='a')
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


# ── Team ──────────────────────────────────────────────────────────────────────

class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('developer',   'Developer'),
        ('trainer',     'Trainer'),
        ('researcher',  'Researcher'),
        ('management',  'Management'),
    ]

    name        = models.CharField(max_length=150)
    designation = models.CharField(max_length=150)
    role        = models.CharField(max_length=20, choices=ROLE_CHOICES)
    bio         = models.TextField(blank=True)
    photo       = models.ImageField(upload_to='team/', blank=True, null=True)
    email       = models.EmailField(blank=True)
    linkedin    = models.URLField(blank=True)
    github      = models.URLField(blank=True)
    is_active   = models.BooleanField(default=True)
    order       = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return f"{self.name} — {self.designation}"


# ── Careers ───────────────────────────────────────────────────────────────────

class JobOpening(models.Model):
    TYPE_CHOICES = [
        ('full_time',   'Full Time'),
        ('part_time',   'Part Time'),
        ('internship',  'Internship'),
        ('contract',    'Contract'),
    ]

    title       = models.CharField(max_length=200)
    role        = models.CharField(max_length=20, choices=TeamMember.ROLE_CHOICES)
    type        = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full_time')
    description = models.TextField()
    requirements= models.TextField()
    location    = models.CharField(max_length=100, default='On-site')
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class CareerApplication(models.Model):
    STATUS_CHOICES = [
        ('received',    'Received'),
        ('reviewing',   'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('rejected',    'Rejected'),
        ('hired',       'Hired'),
    ]

    job         = models.ForeignKey(JobOpening, related_name='applications', on_delete=models.SET_NULL, null=True, blank=True)
    name        = models.CharField(max_length=150)
    email       = models.EmailField()
    phone       = models.CharField(max_length=20, blank=True)
    message     = models.TextField()
    resume      = models.FileField(upload_to='resumes/', blank=True, null=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} → {self.job or 'General Application'}"


# ── Testimonials ──────────────────────────────────────────────────────────────

class Testimonial(models.Model):
    TYPE_CHOICES = [('client', 'Client'), ('student', 'Student')]

    name        = models.CharField(max_length=150)
    designation = models.CharField(max_length=150, blank=True)
    type        = models.CharField(max_length=10, choices=TYPE_CHOICES, default='client')
    content     = models.TextField()
    rating      = models.PositiveSmallIntegerField(default=5)
    photo       = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
