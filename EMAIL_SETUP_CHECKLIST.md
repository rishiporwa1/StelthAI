# ✅ Email Setup Checklist

Use this checklist to set up your contact form email functionality.

## 📋 Pre-Setup

- [ ] I have a Gmail account (or other email provider)
- [ ] I have access to my email account settings
- [ ] Backend server is running (`python manage.py runserver`)
- [ ] Frontend server is running (`npm run dev`)

## 🔧 Configuration Steps

### Step 1: Gmail App Password
- [ ] Visited https://myaccount.google.com/
- [ ] Enabled 2-Step Verification
- [ ] Generated App Password for "Mail"
- [ ] Copied the 16-character password
- [ ] Saved it somewhere safe (you'll need it next)

### Step 2: Update .env File
- [ ] Opened `backend/.env` in text editor
- [ ] Changed `EMAIL_BACKEND` to smtp:
  ```
  EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
  ```
- [ ] Updated `EMAIL_HOST_USER` with my Gmail:
  ```
  EMAIL_HOST_USER=my.email@gmail.com
  ```
- [ ] Updated `EMAIL_HOST_PASSWORD` with App Password:
  ```
  EMAIL_HOST_PASSWORD=abcdefghijklmnop
  ```
- [ ] Updated `CONTACT_RECIPIENT_EMAIL` with my email:
  ```
  CONTACT_RECIPIENT_EMAIL=my.email@gmail.com
  ```
- [ ] Updated `DEFAULT_FROM_EMAIL`:
  ```
  DEFAULT_FROM_EMAIL=TechNova <my.email@gmail.com>
  ```
- [ ] Saved the file

### Step 3: Restart Backend
- [ ] Stopped backend server (Ctrl+C)
- [ ] Started backend server again:
  ```bash
  cd backend
  python manage.py runserver
  ```
- [ ] No errors in terminal

## 🧪 Testing

### Test 1: Email Configuration Test
- [ ] Ran test script:
  ```bash
  cd backend
  python test_email.py
  ```
- [ ] Saw "SUCCESS" message
- [ ] Received test email in inbox
- [ ] Checked spam folder if not in inbox

### Test 2: Contact Form Test
- [ ] Opened http://localhost:5173/contact
- [ ] Filled out the form with test data:
  - Name: Test User
  - Email: my.email@gmail.com
  - Subject: General Inquiry
  - Message: This is a test message
- [ ] Clicked "Send Message"
- [ ] Saw success message on website
- [ ] Received email with form submission
- [ ] Received auto-reply confirmation email

### Test 3: Admin Panel Check
- [ ] Opened http://localhost:8000/admin/
- [ ] Logged in with superuser credentials
- [ ] Clicked "Contact Submissions"
- [ ] Saw my test submission in the list
- [ ] Verified all details are correct

## 🎯 Production Checklist

Before going live:

- [ ] Tested with multiple email addresses
- [ ] Verified emails don't go to spam
- [ ] Updated contact information in Contact.jsx:
  ```javascript
  const INFO = [
    { icon:'📧', label:'Email',   value:'my.email@gmail.com' },
    { icon:'📞', label:'Phone',   value:'+91-1234567890' },
    { icon:'📍', label:'Address', value:'My Office Address' },
  ]
  ```
- [ ] Tested rate limiting (try submitting 6 times quickly)
- [ ] Set up email notifications on phone
- [ ] Documented email password securely
- [ ] Added .env to .gitignore (already done)
- [ ] Never committed .env to Git

## 🔍 Troubleshooting Checklist

If emails aren't working:

- [ ] Checked terminal for error messages
- [ ] Verified EMAIL_BACKEND is set to smtp
- [ ] Verified EMAIL_HOST_USER is correct
- [ ] Verified EMAIL_HOST_PASSWORD is App Password (not regular password)
- [ ] Verified 2-Step Verification is enabled on Gmail
- [ ] Checked spam folder
- [ ] Tried with console backend first to test form:
  ```
  EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
  ```
- [ ] Restarted backend server after changes
- [ ] Checked firewall isn't blocking port 587
- [ ] Read EMAIL_SETUP_GUIDE.md troubleshooting section

## 📊 Success Criteria

You're all set when:

- [x] ✅ Contact form submits successfully
- [x] ✅ You receive email with submission details
- [x] ✅ Customer receives auto-reply confirmation
- [x] ✅ Submission appears in Django Admin
- [x] ✅ No errors in terminal
- [x] ✅ Emails arrive within 1 minute

## 📚 Reference Documents

- **QUICK_EMAIL_SETUP.md** - Quick 3-step guide
- **EMAIL_SETUP_GUIDE.md** - Detailed instructions
- **EMAIL_FLOW_DIAGRAM.md** - Visual flow explanation
- **EMAIL_README.md** - Overview and status

## 🎉 Completion

- [ ] All tests passed
- [ ] Emails working correctly
- [ ] Contact form fully functional
- [ ] Ready for production!

---

**Date Completed:** _______________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
