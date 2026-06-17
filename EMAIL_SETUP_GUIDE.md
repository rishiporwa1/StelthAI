# Email Setup Guide - Contact Form to Your Email

Your contact form is already configured! Follow these steps to receive emails directly to your inbox.

## 🚀 Quick Setup (Gmail)

### Step 1: Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** (left sidebar)
3. Enable **2-Step Verification** (if not already enabled)
4. After enabling 2FA, go back to Security
5. Search for **App passwords** or go to: https://myaccount.google.com/apppasswords
6. Click **Select app** → Choose "Mail"
7. Click **Select device** → Choose "Other" and type "TechNova"
8. Click **Generate**
9. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Update Your .env File

Open `backend/.env` and update these lines:

```env
# Change this line from console to smtp
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# Your Gmail address
EMAIL_HOST_USER=your.email@gmail.com

# The 16-character app password you just generated (no spaces)
EMAIL_HOST_PASSWORD=abcdefghijklmnop

# The email address that will appear as sender
DEFAULT_FROM_EMAIL=TechNova <your.email@gmail.com>

# YOUR email where you want to receive contact form submissions
CONTACT_RECIPIENT_EMAIL=your.email@gmail.com
```

### Step 3: Restart Your Backend Server

```bash
cd backend
python manage.py runserver
```

## ✅ Test It!

1. Go to your Contact page: http://localhost:5173/contact
2. Fill out the form and submit
3. Check your email inbox - you should receive the contact form submission!
4. The person who submitted will also receive an auto-reply confirmation

## 📧 What Happens When Someone Submits?

1. **You receive an email** with:
   - Name of the person
   - Their email address
   - Phone number (if provided)
   - Subject they selected
   - Their message

2. **They receive an auto-reply** confirming:
   - Their message was received
   - You'll respond within 24 business hours
   - A copy of their message

## 🔧 Alternative Email Providers

### Using Outlook/Hotmail

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_HOST_USER=your.email@outlook.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=TechNova <your.email@outlook.com>
CONTACT_RECIPIENT_EMAIL=your.email@outlook.com
```

### Using Custom SMTP (like your domain email)

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_HOST_USER=contact@yourdomain.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=TechNova <contact@yourdomain.com>
CONTACT_RECIPIENT_EMAIL=your.email@yourdomain.com
```

## 🛡️ Security Notes

- ✅ Never commit your `.env` file to Git (it's already in `.gitignore`)
- ✅ Use App Passwords for Gmail (not your regular password)
- ✅ Keep your `EMAIL_HOST_PASSWORD` secret
- ✅ The contact form has rate limiting (5 submissions per hour per IP)

## 🐛 Troubleshooting

### Emails not sending?

1. **Check console output** - Look for error messages in your terminal
2. **Verify credentials** - Make sure email and app password are correct
3. **Check spam folder** - Sometimes emails land in spam
4. **Test with console backend first**:
   ```env
   EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
   ```
   This will print emails to your terminal instead of sending them

### Gmail blocking sign-in?

- Make sure 2-Step Verification is enabled
- Use App Password, not your regular password
- Check if "Less secure app access" needs to be enabled (older accounts)

## 📝 Current Features

✅ Contact form submissions saved to database  
✅ Email notification to you (admin)  
✅ Auto-reply confirmation to sender  
✅ Rate limiting (5 per hour)  
✅ IP address tracking  
✅ Subject categorization  
✅ Admin panel to view all submissions  

## 🎯 Next Steps

1. Update your contact information in `frontend/src/pages/Contact.jsx`:
   ```javascript
   const INFO = [
     { icon:'📧', label:'Email',   value:'your.email@gmail.com' },
     { icon:'📞', label:'Phone',   value:'+91-1234567890' },
     { icon:'📍', label:'Address', value:'Your Office Address' },
   ]
   ```

2. Access Django Admin to view submissions:
   - Go to: http://localhost:8000/admin/
   - Login with your superuser account
   - Click on "Contact Submissions"

## 💡 Pro Tips

- Test the form yourself first before going live
- Check your email spam folder initially
- Consider using a dedicated business email
- Monitor the Django admin panel for submissions
- The form data is also saved in the database as backup

---

**Need Help?** Check the Django logs in your terminal for detailed error messages.
