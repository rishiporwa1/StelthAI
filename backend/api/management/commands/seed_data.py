"""
Usage: python manage.py seed_data

Populates the DB with demo data matching the website content.
"""

from django.core.management.base import BaseCommand
from api.models import (
    ServiceCategory, ServiceItem, Course, CourseFeature,
    ResearchArea, TeamMember, JobOpening,
)


class Command(BaseCommand):
    help = 'Seed database with demo data from the website content'

    def handle(self, *args, **options):
        self._seed_services()
        self._seed_courses()
        self._seed_research()
        self._seed_team()
        self._seed_jobs()
        self.stdout.write(self.style.SUCCESS('✅  Database seeded successfully!'))

    def _seed_services(self):
        services = [
            {
                'name': 'Software Development', 'slug': 'software-development',
                'tag': 'CORE', 'icon': '⚙️', 'order': 1,
                'description': 'We design and develop customized software tailored to organizational needs.',
                'items': ['ERP Systems', 'Management Information Systems', 'Automation Software',
                          'AI & Machine Learning Applications', 'Data Analytics Dashboards', 'Cloud-Based Applications'],
            },
            {
                'name': 'Web Development', 'slug': 'web-development',
                'tag': 'WEB', 'icon': '🌐', 'order': 2,
                'description': 'Modern, responsive web solutions for every business need.',
                'items': ['Business Websites', 'E-commerce Platforms', 'Portals & Dashboards', 'Responsive UI/UX Design'],
            },
            {
                'name': 'Mobile App Development', 'slug': 'mobile-development',
                'tag': 'MOBILE', 'icon': '📱', 'order': 3,
                'description': 'Cross-platform mobile applications for enterprise and consumer use.',
                'items': ['Android Applications', 'Cross-platform Applications', 'Enterprise Mobile Solutions'],
            },
            {
                'name': 'IT Services', 'slug': 'it-services',
                'tag': 'OPS', 'icon': '🛠️', 'order': 4,
                'description': 'Comprehensive IT support, consulting, and infrastructure services.',
                'items': ['System Maintenance', 'Technical Consulting', 'Software Testing & QA',
                          'Database Design & Optimization', 'Deployment & Support'],
            },
        ]
        for s in services:
            items = s.pop('items')
            cat, created = ServiceCategory.objects.get_or_create(slug=s['slug'], defaults=s)
            if created:
                for i, name in enumerate(items):
                    ServiceItem.objects.create(category=cat, name=name, order=i)
        self.stdout.write('  → Services seeded')

    def _seed_courses(self):
        courses = [
            {'title': 'Python Programming',            'slug': 'python-programming',          'level': 'beginner',     'duration': '6 weeks',  'is_popular': True,  'icon': '🐍'},
            {'title': 'Data Science & Machine Learning','slug': 'data-science-ml',             'level': 'intermediate', 'duration': '12 weeks', 'is_popular': True,  'icon': '📊'},
            {'title': 'Artificial Intelligence & Deep Learning','slug': 'ai-deep-learning',   'level': 'advanced',     'duration': '16 weeks', 'is_popular': True,  'icon': '🤖'},
            {'title': 'Full Stack Web Development',    'slug': 'full-stack-web',              'level': 'intermediate', 'duration': '12 weeks', 'is_popular': True,  'icon': '🌐'},
            {'title': 'Database Management & SQL',     'slug': 'database-sql',                'level': 'beginner',     'duration': '4 weeks',  'is_popular': False, 'icon': '🗄️'},
            {'title': 'Cloud Computing',               'slug': 'cloud-computing',             'level': 'intermediate', 'duration': '8 weeks',  'is_popular': False, 'icon': '☁️'},
            {'title': 'Cybersecurity Fundamentals',    'slug': 'cybersecurity-fundamentals',  'level': 'beginner',     'duration': '6 weeks',  'is_popular': False, 'icon': '🔒'},
        ]
        features = ['Hands-on projects', 'Industry case studies', 'Certification', 'Resume building', 'Mock interviews']
        for i, c in enumerate(courses):
            c.update({'order': i, 'description': f"Comprehensive {c['title']} course with practical exposure."})
            course, created = Course.objects.get_or_create(slug=c['slug'], defaults=c)
            if created:
                for j, f in enumerate(features):
                    CourseFeature.objects.create(course=course, text=f, order=j)
        self.stdout.write('  → Courses seeded')

    def _seed_research(self):
        areas = [
            ('Artificial Intelligence', 'a'), ('Deep Learning', 'a'),
            ('Computer Vision', 'b'), ('Image Processing', 'b'),
            ('Natural Language Processing', 'a'),
            ('IoT & Smart Systems', 'c'),
            ('Agriculture Applications', 'b'), ('Healthcare Tech', 'c'),
            ('Data Analytics', 'b'), ('Predictive Modeling', 'a'),
        ]
        for name, style in areas:
            ResearchArea.objects.get_or_create(name=name, defaults={'style': style})
        self.stdout.write('  → Research areas seeded')

    def _seed_team(self):
        members = [
            {'name': 'Dr. Arun Sharma',   'designation': 'Founder & CEO',          'role': 'management'},
            {'name': 'Priya Mehta',        'designation': 'Lead Developer',          'role': 'developer'},
            {'name': 'Rahul Verma',        'designation': 'Data Science Lead',       'role': 'researcher'},
            {'name': 'Sunita Patel',       'designation': 'Training Head',           'role': 'trainer'},
        ]
        for i, m in enumerate(members):
            m.update({'order': i, 'bio': f"{m['name']} brings deep expertise in their domain."})
            TeamMember.objects.get_or_create(name=m['name'], defaults=m)
        self.stdout.write('  → Team seeded')

    def _seed_jobs(self):
        jobs = [
            {'title': 'Python / Django Developer', 'role': 'developer',  'type': 'full_time',
             'description': 'Build and maintain backend APIs for our platforms.',
             'requirements': 'Python, Django, REST APIs, Git. 1+ year experience.'},
            {'title': 'React Frontend Developer',  'role': 'developer',  'type': 'full_time',
             'description': 'Develop modern React UIs for our web products.',
             'requirements': 'React, JavaScript, CSS, REST integration.'},
            {'title': 'IT Trainer',                'role': 'trainer',    'type': 'part_time',
             'description': 'Conduct training sessions in Python, ML, and Web Dev.',
             'requirements': 'Strong domain knowledge, communication skills, teaching experience.'},
            {'title': 'ML Research Intern',        'role': 'researcher', 'type': 'internship',
             'description': 'Assist in research projects involving deep learning and computer vision.',
             'requirements': 'Python, PyTorch/TensorFlow basics, final year student.'},
        ]
        for j in jobs:
            j['location'] = 'On-site'
            JobOpening.objects.get_or_create(title=j['title'], defaults=j)
        self.stdout.write('  → Job openings seeded')
