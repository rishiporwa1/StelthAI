from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    # Auth
    RegisterView, MeView, ChangePasswordView, LogoutView,
    # Contact
    ContactSubmitView,
    # Services
    ServiceListView,
    # Courses
    CourseListView, CourseDetailView,
    # Research
    ResearchAreaListView,
    # Team
    TeamListView,
    # Careers
    JobOpeningListView, CareerApplicationView,
    # Testimonials
    TestimonialListView,
    # Dashboard
    admin_dashboard_stats,
    # Admin CRUD
    AdminContactViewSet, AdminServiceCategoryViewSet, AdminServiceItemViewSet,
    AdminCourseViewSet, AdminCourseFeatureViewSet, AdminResearchAreaViewSet,
    AdminTeamMemberViewSet, AdminJobOpeningViewSet,
    AdminCareerApplicationViewSet, AdminTestimonialViewSet,
)

# ── Admin Router ──────────────────────────────────────────────────────────────
router = DefaultRouter()
router.register(r'admin/contacts',      AdminContactViewSet,         basename='admin-contacts')
router.register(r'admin/services',      AdminServiceCategoryViewSet, basename='admin-services')
router.register(r'admin/service-items', AdminServiceItemViewSet,     basename='admin-service-items')
router.register(r'admin/courses',       AdminCourseViewSet,          basename='admin-courses')
router.register(r'admin/course-features', AdminCourseFeatureViewSet, basename='admin-course-features')
router.register(r'admin/research',      AdminResearchAreaViewSet,    basename='admin-research')
router.register(r'admin/team',          AdminTeamMemberViewSet,      basename='admin-team')
router.register(r'admin/jobs',          AdminJobOpeningViewSet,      basename='admin-jobs')
router.register(r'admin/applications',  AdminCareerApplicationViewSet, basename='admin-applications')
router.register(r'admin/testimonials',  AdminTestimonialViewSet,     basename='admin-testimonials')

urlpatterns = [

    # ── Auth ──────────────────────────────────────────────────────────────────
    path('auth/register/',        RegisterView.as_view(),        name='register'),
    path('auth/login/',           TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/',   TokenRefreshView.as_view(),    name='token_refresh'),
    path('auth/logout/',          LogoutView.as_view(),          name='logout'),
    path('auth/me/',              MeView.as_view(),              name='me'),
    path('auth/change-password/', ChangePasswordView.as_view(),  name='change_password'),

    # ── Public API ────────────────────────────────────────────────────────────
    path('contact/',              ContactSubmitView.as_view(),   name='contact'),
    path('services/',             ServiceListView.as_view(),     name='services'),
    path('courses/',              CourseListView.as_view(),      name='courses'),
    path('courses/<slug:slug>/',  CourseDetailView.as_view(),    name='course_detail'),
    path('research/',             ResearchAreaListView.as_view(),name='research'),
    path('team/',                 TeamListView.as_view(),        name='team'),
    path('jobs/',                 JobOpeningListView.as_view(),  name='jobs'),
    path('careers/apply/',        CareerApplicationView.as_view(),name='career_apply'),
    path('testimonials/',         TestimonialListView.as_view(), name='testimonials'),

    # ── Admin Only ────────────────────────────────────────────────────────────
    path('dashboard/stats/',      admin_dashboard_stats,         name='dashboard_stats'),

    # ── Admin CRUD (router-generated) ─────────────────────────────────────────
] + router.urls
