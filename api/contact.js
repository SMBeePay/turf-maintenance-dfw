import { Resend } from 'resend';
import { saveSubmission } from './submissions.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      organization,
      'field-type': fieldType,
      'field-size': fieldSize,
      'service-needed': serviceNeeded,
      urgency,
      location,
      message
    } = req.body;

    // Basic validation
    if (!name || !email || !phone || !fieldType || !serviceNeeded || !location) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Initialize Resend (you'll need to set RESEND_API_KEY in Vercel environment variables)
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const adminEmail = 'andrew@texasturfmaintenance.com';
    
    // Create email content
    const emailHtml = `
      <h2>New Contact Form Submission - Texas Turf Maintenance</h2>
      
      <h3>Customer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
        <li><strong>Organization:</strong> ${organization || 'Not specified'}</li>
        <li><strong>Location:</strong> ${location}</li>
      </ul>

      <h3>Service Request:</h3>
      <ul>
        <li><strong>Field Type:</strong> ${fieldType}</li>
        <li><strong>Field Size:</strong> ${fieldSize || 'Not specified'}</li>
        <li><strong>Service Needed:</strong> ${serviceNeeded}</li>
        <li><strong>Urgency:</strong> ${urgency || 'Not specified'}</li>
      </ul>

      <h3>Additional Details:</h3>
      <p>${message ? message.replace(/\n/g, '<br>') : 'None provided'}</p>

      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</small></p>
    `;

    // Send email using Resend
    try {
      const emailResponse = await resend.emails.send({
        from: 'contact-form@texasturfmaintenance.com',
        to: adminEmail,
        subject: `New Contact Form: ${name} - ${serviceNeeded}`,
        html: emailHtml,
        reply_to: email
      });

      console.log('Email sent successfully:', emailResponse.id);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue with the process even if email fails
    }

    // Save submission to backup database
    try {
      const submissionData = {
        name,
        email,
        phone,
        organization,
        fieldType,
        fieldSize,
        serviceNeeded,
        urgency,
        location,
        message
      };
      
      saveSubmission(submissionData);
      console.log('Submission saved to backup database');
    } catch (saveError) {
      console.error('Error saving to backup database:', saveError);
      // Continue even if backup fails
    }

    return res.status(200).json({ 
      message: 'Form submitted successfully! We will contact you within 24 hours.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ message: 'Internal server error. Please try again or contact us directly.' });
  }
}