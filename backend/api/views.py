from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User

from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    ContactSubmission, ServiceCategory, ServiceItem, Course, CourseFeature,
    ResearchArea, TeamMember, JobOpening, CareerApplication, Testimonial,
)
from .serializers import (
    RegisterSerializer, UserSerializer, ChangePasswordSerializer,
    ContactSubmissionSerializer, ContactSubmissionAdminSerializer,
    ServiceCategorySerializer,
    CourseSerializer,
    ResearchAreaSerializer,
    TeamMemberSerializer,
    JobOpeningSerializer, CareerApplicationSerializer,
    TestimonialSerializer,
    # Admin serializers
    AdminServiceCategorySerializer, AdminServiceItemSerializer,
    AdminCourseSerializer, AdminCourseFeatureSerializer,
    AdminResearchAreaSerializer, AdminTeamMemberSerializer,
    AdminJobOpeningSerializer, AdminCareerApplicationSerializer,
    AdminTestimonialSerializer,
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        return x_forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


# ── Auth Views ────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/"""
    queryset         = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user':    UserSerializer(user).data,
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class MeView(generics.RetrieveUpdateAPIView):
    """GET / PATCH /api/auth/me/"""
    serializer_class   = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()
        return Response({'detail': 'Password updated successfully.'})


class LogoutView(APIView):
    """POST /api/auth/logout/  — blacklists the refresh token"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logged out.'})
        except Exception:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


# ── Contact ───────────────────────────────────────────────────────────────────

class ContactThrottle(ScopedRateThrottle):
    scope = 'contact'


class ContactSubmitView(generics.CreateAPIView):
    """POST /api/contact/  — public, rate-limited"""
    serializer_class   = ContactSubmissionSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes   = [ContactThrottle]

    def perform_create(self, serializer):
        submission = serializer.save(ip_address=get_client_ip(self.request))
        self._send_emails(submission)

    def _send_emails(self, sub):
        # Notification to admin
        try:
            send_mail(
                subject=f'[TechNova] New inquiry: {sub.get_subject_display()}',
                message=(
                    f'Name: {sub.name}\n'
                    f'Email: {sub.email}\n'
                    f'Phone: {sub.phone or "—"}\n'
                    f'Subject: {sub.get_subject_display()}\n\n'
                    f'Message:\n{sub.message}'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
                fail_silently=True,
            )
            # Auto-reply to sender
            send_mail(
                subject='Thanks for reaching out — TechNova',
                message=(
                    f'Hi {sub.name},\n\n'
                    f'We have received your message and will get back to you within 24 business hours.\n\n'
                    f'Your message:\n"{sub.message}"\n\n'
                    f'— TechNova Team'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[sub.email],
                fail_silently=True,
            )
        except Exception:
            pass   # never crash the API because of email


# ── Services ──────────────────────────────────────────────────────────────────

class ServiceListView(generics.ListAPIView):
    """GET /api/services/"""
    queryset           = ServiceCategory.objects.filter(is_active=True).prefetch_related('items')
    serializer_class   = ServiceCategorySerializer
    permission_classes = [permissions.AllowAny]


# ── Training / Courses ────────────────────────────────────────────────────────

class CourseListView(generics.ListAPIView):
    """GET /api/courses/   ?popular=true  ?level=beginner"""
    serializer_class   = CourseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Course.objects.filter(is_active=True).prefetch_related('features')
        if self.request.query_params.get('popular') == 'true':
            qs = qs.filter(is_popular=True)
        level = self.request.query_params.get('level')
        if level:
            qs = qs.filter(level=level)
        return qs


class CourseDetailView(generics.RetrieveAPIView):
    """GET /api/courses/<slug>/"""
    queryset           = Course.objects.filter(is_active=True).prefetch_related('features')
    serializer_class   = CourseSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = 'slug'


# ── Research ──────────────────────────────────────────────────────────────────

class ResearchAreaListView(generics.ListAPIView):
    """GET /api/research/"""
    queryset           = ResearchArea.objects.filter(is_active=True)
    serializer_class   = ResearchAreaSerializer
    permission_classes = [permissions.AllowAny]


# ── Team ──────────────────────────────────────────────────────────────────────

class TeamListView(generics.ListAPIView):
    """GET /api/team/   ?role=developer"""
    serializer_class   = TeamMemberSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs   = TeamMember.objects.filter(is_active=True)
        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)
        return qs


# ── Careers ───────────────────────────────────────────────────────────────────

class JobOpeningListView(generics.ListAPIView):
    """GET /api/jobs/"""
    queryset           = JobOpening.objects.filter(is_active=True)
    serializer_class   = JobOpeningSerializer
    permission_classes = [permissions.AllowAny]


class CareerApplicationView(generics.CreateAPIView):
    """POST /api/careers/apply/"""
    serializer_class   = CareerApplicationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes   = [ContactThrottle]

    def perform_create(self, serializer):
        application = serializer.save()
        try:
            send_mail(
                subject=f'[TechNova] New application: {application.name}',
                message=(
                    f'Name: {application.name}\n'
                    f'Email: {application.email}\n'
                    f'Phone: {application.phone or "—"}\n'
                    f'Position: {application.job or "General"}\n\n'
                    f'Message:\n{application.message}'
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass


# ── Testimonials ──────────────────────────────────────────────────────────────

class TestimonialListView(generics.ListAPIView):
    """GET /api/testimonials/   ?type=client|student"""
    serializer_class   = TestimonialSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs   = Testimonial.objects.filter(is_active=True)
        type_ = self.request.query_params.get('type')
        if type_:
            qs = qs.filter(type=type_)
        return qs


# ── Dashboard (auth required) ─────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_dashboard_stats(request):
    """GET /api/dashboard/stats/  — admin only"""
    from .models import ContactSubmission
    return Response({
        'contacts': {
            'total':       ContactSubmission.objects.count(),
            'new':         ContactSubmission.objects.filter(status='new').count(),
            'in_progress': ContactSubmission.objects.filter(status='in_progress').count(),
        },
        'applications': {
            'total':      CareerApplication.objects.count(),
            'received':   CareerApplication.objects.filter(status='received').count(),
            'shortlisted':CareerApplication.objects.filter(status='shortlisted').count(),
        },
        'courses':   Course.objects.filter(is_active=True).count(),
        'team':      TeamMember.objects.filter(is_active=True).count(),
        'jobs':      JobOpening.objects.filter(is_active=True).count(),
        'testimonials': Testimonial.objects.filter(is_active=True).count(),
        'services':  ServiceCategory.objects.filter(is_active=True).count(),
        'research':  ResearchArea.objects.filter(is_active=True).count(),
    })


# ── Admin CRUD ViewSets ───────────────────────────────────────────────────────

class AdminContactViewSet(ModelViewSet):
    """Full CRUD on contact submissions — admin only."""
    queryset           = ContactSubmission.objects.all()
    serializer_class   = ContactSubmissionAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminServiceCategoryViewSet(ModelViewSet):
    queryset           = ServiceCategory.objects.prefetch_related('items').all()
    serializer_class   = AdminServiceCategorySerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminServiceItemViewSet(ModelViewSet):
    queryset           = ServiceItem.objects.select_related('category').all()
    serializer_class   = AdminServiceItemSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminCourseViewSet(ModelViewSet):
    queryset           = Course.objects.prefetch_related('features').all()
    serializer_class   = AdminCourseSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminCourseFeatureViewSet(ModelViewSet):
    queryset           = CourseFeature.objects.select_related('course').all()
    serializer_class   = AdminCourseFeatureSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminResearchAreaViewSet(ModelViewSet):
    queryset           = ResearchArea.objects.all()
    serializer_class   = AdminResearchAreaSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminTeamMemberViewSet(ModelViewSet):
    queryset           = TeamMember.objects.all()
    serializer_class   = AdminTeamMemberSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminJobOpeningViewSet(ModelViewSet):
    queryset           = JobOpening.objects.all()
    serializer_class   = AdminJobOpeningSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminCareerApplicationViewSet(ModelViewSet):
    queryset           = CareerApplication.objects.select_related('job').all()
    serializer_class   = AdminCareerApplicationSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None


class AdminTestimonialViewSet(ModelViewSet):
    queryset           = Testimonial.objects.all()
    serializer_class   = AdminTestimonialSerializer
    permission_classes = [permissions.IsAdminUser]
    pagination_class   = None
