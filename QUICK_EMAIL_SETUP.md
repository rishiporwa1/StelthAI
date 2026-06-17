# 📧 Quick Email Setup - 3 Steps

## Step 1: Get Gmail App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification if asked
3. Create app password for "Mail" → "Other (TechNova)"
4. Copy the 16-character password

## Step 2: Update backend/.env
```env
# Change this line:
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# Add your details:
EMAIL_HOST_USER=your.email@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
CONTACT_RECIPIENT_EMAIL=your.email@gmail.com
DEFAULT_FROM_EMAIL=TechNova <your.email@gmail.com>
```

## Step 3: Restart Backend
```bash
cd backend
python manage.py runserver
```

## ✅ Test It
1. Go to http://localhost:5173/contact
2. Fill and submit the form
3. Check your email inbox!

---

**See EMAIL_SETUP_GUIDE.md for detailed instructions**
