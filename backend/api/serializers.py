from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    ContactSubmission, ServiceCategory, ServiceItem,
    Course, CourseFeature, ResearchArea, TeamMember,
    JobOpening, CareerApplication, Testimonial,
)


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirm Password')

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Passwords do not match.'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already registered.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_staff']
        read_only_fields = ['id', 'date_joined', 'is_staff']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value


# ── Contact ───────────────────────────────────────────────────────────────────

class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactSubmission
        fields = ['id', 'name', 'email', 'phone', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError('Message must be at least 10 characters.')
        return value


class ContactSubmissionAdminSerializer(serializers.ModelSerializer):
    """Full serializer for admin use — includes status, notes, IP."""
    class Meta:
        model  = ContactSubmission
        fields = '__all__'


# ── Services ──────────────────────────────────────────────────────────────────

class ServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ServiceItem
        fields = ['id', 'name', 'description', 'order']


class ServiceCategorySerializer(serializers.ModelSerializer):
    items = ServiceItemSerializer(many=True, read_only=True)

    class Meta:
        model  = ServiceCategory
        fields = ['id', 'name', 'slug', 'tag', 'description', 'icon', 'order', 'items']


# ── Training ──────────────────────────────────────────────────────────────────

class CourseFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CourseFeature
        fields = ['id', 'text', 'icon', 'order']


class CourseSerializer(serializers.ModelSerializer):
    features = CourseFeatureSerializer(many=True, read_only=True)

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'slug', 'description', 'level',
            'duration', 'price', 'is_free', 'is_popular',
            'icon', 'order', 'features', 'created_at',
        ]


# ── Research ──────────────────────────────────────────────────────────────────

class ResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ResearchArea
        fields = ['id', 'name', 'description', 'style']


# ── Team ──────────────────────────────────────────────────────────────────────

class TeamMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = TeamMember
        fields = [
            'id', 'name', 'designation', 'role', 'bio',
            'photo_url', 'email', 'linkedin', 'github', 'order',
        ]

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None


# ── Careers ───────────────────────────────────────────────────────────────────

class JobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobOpening
        fields = ['id', 'title', 'role', 'type', 'description', 'requirements', 'location', 'created_at']


class CareerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CareerApplication
        fields = ['id', 'job', 'name', 'email', 'phone', 'message', 'resume', 'created_at']
        read_only_fields = ['id', 'created_at']


# ── Testimonials ──────────────────────────────────────────────────────────────

class TestimonialSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = Testimonial
        fields = ['id', 'name', 'designation', 'type', 'content', 'rating', 'photo_url', 'created_at']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None


# ── Admin Serializers (full field access) ─────────────────────────────────────

class AdminServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ServiceCategory
        fields = '__all__'


class AdminServiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ServiceItem
        fields = '__all__'


class AdminCourseSerializer(serializers.ModelSerializer):
    features = CourseFeatureSerializer(many=True, read_only=True)

    class Meta:
        model  = Course
        fields = '__all__'


class AdminCourseFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CourseFeature
        fields = '__all__'


class AdminResearchAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ResearchArea
        fields = '__all__'


class AdminTeamMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = TeamMember
        fields = '__all__'

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None


class AdminJobOpeningSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobOpening
        fields = '__all__'


class AdminCareerApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True, default='General')

    class Meta:
        model  = CareerApplication
        fields = '__all__'


class AdminTestimonialSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model  = Testimonial
        fields = '__all__'

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo and request:
            return request.build_absolute_uri(obj.photo.url)
        return None
