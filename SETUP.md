# Texas Turf Maintenance - Setup Guide

## Email Configuration

To enable form submissions and email notifications, you need to set up Resend email service:

### 1. Create Resend Account
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your account and complete the setup

### 2. Add Your Domain
1. In the Resend dashboard, go to "Domains"
2. Add `texasturfmaintenance.com` as your domain
3. Follow the DNS configuration instructions to verify your domain
4. This will allow you to send emails from `contact-form@texasturfmaintenance.com`

### 3. Get API Key
1. In the Resend dashboard, go to "API Keys"
2. Create a new API key with "Send" permissions
3. Copy the API key (starts with `re_`)

### 4. Configure Vercel Environment Variables
1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following environment variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (the one starting with `re_`)
   - **Environment**: All (Production, Preview, Development)

### 5. Deploy to Vercel
Once the environment variable is set, deploy your site to Vercel. The contact form will now:
- Send emails to `andrew@texasturfmaintenance.com`
- Save form submissions to a backup JSON file
- Show success/error messages to users

## Form Features

The contact form includes:
- ✅ Email notifications via Resend
- ✅ Backup storage of submissions
- ✅ Form validation
- ✅ Loading states and error handling
- ✅ Mobile-responsive design

## Contact Information Updated

All contact information has been updated to use:
- **Email**: andrew@texasturfmaintenance.com
- **Phone numbers**: Removed (no phone service yet)

## Accessing Form Submissions

Form submissions are automatically:
1. Emailed to andrew@texasturfmaintenance.com
2. Saved to `/data/submissions.json` as backup
3. Accessible via the `/api/submissions` endpoint (requires authentication in production)

## Security Notes

- The API includes basic validation
- Environment variables keep API keys secure
- Form includes CSRF protection through Vercel's built-in security
- Consider adding rate limiting for production use

## Troubleshooting

If forms aren't working:
1. Check Vercel function logs in your dashboard
2. Verify the `RESEND_API_KEY` environment variable is set
3. Ensure your domain is verified in Resend
4. Check that the domain DNS records are configured correctly