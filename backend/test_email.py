"""
Email Configuration Test Script
Run this to verify your email settings are working correctly.

Usage:
    cd backend
    python test_email.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'technova.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    print("=" * 60)
    print("📧 EMAIL CONFIGURATION TEST")
    print("=" * 60)
    print()
    
    # Display current settings
    print("Current Email Settings:")
    print(f"  Backend: {settings.EMAIL_BACKEND}")
    print(f"  Host: {settings.EMAIL_HOST}")
    print(f"  Port: {settings.EMAIL_PORT}")
    print(f"  User: {settings.EMAIL_HOST_USER}")
    print(f"  From: {settings.DEFAULT_FROM_EMAIL}")
    print(f"  Recipient: {settings.CONTACT_RECIPIENT_EMAIL}")
    print()
    
    # Check if using console backend
    if 'console' in settings.EMAIL_BACKEND.lower():
        print("⚠️  WARNING: Using Console Backend")
        print("   Emails will be printed to terminal, not sent.")
        print("   To send real emails, update .env:")
        print("   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend")
        print()
    
    # Check if credentials are set
    if not settings.EMAIL_HOST_USER or settings.EMAIL_HOST_USER == 'your@gmail.com':
        print("❌ ERROR: Email credentials not configured!")
        print("   Please update backend/.env with your email settings.")
        print("   See EMAIL_SETUP_GUIDE.md for instructions.")
        return
    
    # Send test email
    print("Sending test email...")
    print()
    
    try:
        send_mail(
            subject='[TechNova] Test Email - Configuration Successful! ✅',
            message=(
                'Congratulations!\n\n'
                'Your email configuration is working correctly.\n\n'
                'Your contact form is now ready to receive submissions.\n\n'
                'Test Details:\n'
                f'- From: {settings.DEFAULT_FROM_EMAIL}\n'
                f'- To: {settings.CONTACT_RECIPIENT_EMAIL}\n'
                f'- Backend: {settings.EMAIL_BACKEND}\n\n'
                'Next Steps:\n'
                '1. Test the contact form at http://localhost:5173/contact\n'
                '2. Check your inbox for submissions\n'
                '3. View submissions in Django Admin\n\n'
                '— TechNova Email System'
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
            fail_silently=False,
        )
        
        print("✅ SUCCESS! Test email sent successfully!")
        print()
        print("Next Steps:")
        print("  1. Check your inbox:", settings.CONTACT_RECIPIENT_EMAIL)
        print("  2. Check spam folder if not in inbox")
        print("  3. Test the contact form at http://localhost:5173/contact")
        print()
        
    except Exception as e:
        print("❌ ERROR: Failed to send email")
        print()
        print("Error Details:")
        print(f"  {str(e)}")
        print()
        print("Common Issues:")
        print("  • Wrong email or password in .env")
        print("  • Not using Gmail App Password")
        print("  • 2-Step Verification not enabled")
        print("  • Firewall blocking SMTP port 587")
        print()
        print("Solutions:")
        print("  1. Verify EMAIL_HOST_USER in .env")
        print("  2. Get App Password: https://myaccount.google.com/apppasswords")
        print("  3. Check EMAIL_HOST_PASSWORD in .env")
        print("  4. See EMAIL_SETUP_GUIDE.md for help")
        print()
    
    print("=" * 60)

if __name__ == '__main__':
    test_email()
