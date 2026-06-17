# 📬 Contact Form Email Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER FILLS CONTACT FORM                      │
│  Name: John Doe                                                 │
│  Email: john@example.com                                        │
│  Subject: Software Development                                  │
│  Message: I need a website...                                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND SENDS TO BACKEND API                      │
│              POST /api/contact/                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND PROCESSES                              │
│  1. Validates data                                              │
│  2. Saves to database (ContactSubmission model)                 │
│  3. Sends TWO emails                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ├──────────────────┬─────────────────────┐
                         ▼                  ▼                     ▼
              ┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
              │  DATABASE        │  │  EMAIL #1    │  │  EMAIL #2       │
              │  ✓ Saved         │  │  To: YOU     │  │  To: CUSTOMER   │
              │  ✓ Viewable in   │  │  Subject:    │  │  Subject:       │
              │    Admin Panel   │  │  New inquiry │  │  Thanks for     │
              │                  │  │              │  │  reaching out   │
              └──────────────────┘  └──────────────┘  └─────────────────┘
                                            │
                                            ▼
                                    ┌──────────────────┐
                                    │  YOUR INBOX      │
                                    │  📧 New Message! │
                                    │                  │
                                    │  From: John Doe  │
                                    │  john@example.com│
                                    │                  │
                                    │  Message:        │
                                    │  I need a        │
                                    │  website...      │
                                    └──────────────────┘
```

## 🔄 Complete Flow Example

### When John submits the form:

**1. Form Submission**
```
Name: John Doe
Email: john@example.com
Phone: +91-9876543210
Subject: Software Development
Message: I need a website for my business...
```

**2. You Receive (at your@gmail.com):**
```
Subject: [TechNova] New inquiry: Software Development

Name: John Doe
Email: john@example.com
Phone: +91-9876543210
Subject: Software Development

Message:
I need a website for my business...
```

**3. John Receives (at john@example.com):**
```
Subject: Thanks for reaching out — TechNova

Hi John Doe,

We have received your message and will get back to you 
within 24 business hours.

Your message:
"I need a website for my business..."

— TechNova Team
```

**4. Database Record:**
```
✓ Saved in Django Admin
✓ Status: New
✓ Timestamp: 2024-01-15 10:30 AM
✓ IP Address: 192.168.1.1
```

## 🎯 Key Features

✅ **Instant Notification** - You get email immediately  
✅ **Auto-Reply** - Customer gets confirmation  
✅ **Database Backup** - All submissions saved  
✅ **Rate Limited** - Max 5 per hour per IP  
✅ **Admin Panel** - View all submissions  
✅ **Status Tracking** - Mark as new/in-progress/resolved  

## 📊 View Submissions

### Option 1: Email
- Check your inbox for new submissions

### Option 2: Django Admin
```bash
# Go to: http://localhost:8000/admin/
# Login with superuser credentials
# Click: Contact Submissions
```

You can:
- View all submissions
- Filter by status/date
- Add admin notes
- Mark as resolved
- Export data

## 🔐 Security Features

- ✅ Rate limiting (5 submissions/hour per IP)
- ✅ Email validation
- ✅ CSRF protection
- ✅ IP address logging
- ✅ Spam status option
- ✅ Secure password storage (App Password)

---

**Ready to go live?** Just update your .env file and restart the backend!
