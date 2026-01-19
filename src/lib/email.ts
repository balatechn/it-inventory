import Mailgun from 'mailgun.js';
import formData from 'form-data';

const mailgun = new Mailgun(formData);

// Initialize Mailgun client
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || '',
});

const DOMAIN = process.env.MAILGUN_DOMAIN || '';
const FROM_EMAIL = process.env.MAILGUN_FROM_EMAIL || 'IT Assets <noreply@nationalgroupindia.com>';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(options: EmailOptions) {
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.warn('Mailgun not configured. Skipping email send.');
    return null;
  }

  try {
    const messageData: any = {
      from: FROM_EMAIL,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
    };

    if (options.html) {
      messageData.html = options.html;
    }
    if (options.text) {
      messageData.text = options.text;
    }
    
    // Default to a simple text message if neither is provided
    if (!messageData.html && !messageData.text) {
      messageData.text = '';
    }

    const result = await mg.messages.create(DOMAIN, messageData);

    console.log('Email sent successfully:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Email templates
export const emailTemplates = {
  newRequest: (data: {
    requestNumber: string;
    title: string;
    requesterName: string;
    requesterEmail: string;
    company: string;
    priority: string;
    description: string;
  }) => ({
    subject: `New IT Request: ${data.requestNumber} - ${data.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #070B47; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .label { font-weight: bold; color: #070B47; }
          .priority-high { color: #dc2626; font-weight: bold; }
          .priority-medium { color: #f59e0b; font-weight: bold; }
          .priority-low { color: #10b981; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IT Inventory Management System</h1>
            <p>National Group India</p>
          </div>
          <div class="content">
            <h2>New IT Asset Request Submitted</h2>
            <div class="details">
              <p><span class="label">Request Number:</span> ${data.requestNumber}</p>
              <p><span class="label">Title:</span> ${data.title}</p>
              <p><span class="label">Requester:</span> ${data.requesterName} (${data.requesterEmail})</p>
              <p><span class="label">Company:</span> ${data.company}</p>
              <p><span class="label">Priority:</span> <span class="priority-${data.priority.toLowerCase()}">${data.priority}</span></p>
              <p><span class="label">Description:</span></p>
              <p>${data.description}</p>
            </div>
            <p>Please review and process this request at your earliest convenience.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from IT Inventory Management System</p>
            <p>© ${new Date().getFullYear()} National Group India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  requestStatusUpdate: (data: {
    requestNumber: string;
    title: string;
    status: string;
    requesterName: string;
    comments?: string;
  }) => ({
    subject: `Request ${data.requestNumber} Status Update: ${data.status}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #070B47; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; }
          .status-approved { background-color: #10b981; }
          .status-rejected { background-color: #dc2626; }
          .status-in_progress { background-color: #f59e0b; }
          .status-completed { background-color: #3b82f6; }
          .status-pending { background-color: #6b7280; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IT Inventory Management System</h1>
            <p>National Group India</p>
          </div>
          <div class="content">
            <h2>Request Status Update</h2>
            <p>Dear ${data.requesterName},</p>
            <p>Your IT request <strong>${data.requestNumber}</strong> has been updated.</p>
            <p><strong>Request Title:</strong> ${data.title}</p>
            <p><strong>New Status:</strong> <span class="status-badge status-${data.status.toLowerCase()}">${data.status.replace('_', ' ')}</span></p>
            ${data.comments ? `<p><strong>Comments:</strong> ${data.comments}</p>` : ''}
          </div>
          <div class="footer">
            <p>This is an automated message from IT Inventory Management System</p>
            <p>© ${new Date().getFullYear()} National Group India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  warrantyExpiryAlert: (data: {
    assetTag: string;
    model: string;
    expiryDate: Date;
    assignedTo?: string;
    daysRemaining: number;
  }) => ({
    subject: `Warranty Expiry Alert: ${data.assetTag} - ${data.daysRemaining} days remaining`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #070B47; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .alert-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IT Inventory Management System</h1>
            <p>National Group India</p>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>⚠️ Warranty Expiry Alert</h2>
              <p>The following asset's warranty is expiring soon:</p>
            </div>
            <p><strong>Asset Tag:</strong> ${data.assetTag}</p>
            <p><strong>Model:</strong> ${data.model}</p>
            <p><strong>Expiry Date:</strong> ${data.expiryDate.toLocaleDateString('en-IN')}</p>
            <p><strong>Days Remaining:</strong> ${data.daysRemaining}</p>
            ${data.assignedTo ? `<p><strong>Assigned To:</strong> ${data.assignedTo}</p>` : ''}
            <p>Please take appropriate action to renew or extend the warranty.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from IT Inventory Management System</p>
            <p>© ${new Date().getFullYear()} National Group India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  licenseExpiryAlert: (data: {
    softwareName: string;
    vendor: string;
    expiryDate: Date;
    totalLicenses: number;
    daysRemaining: number;
  }) => ({
    subject: `License Expiry Alert: ${data.softwareName} - ${data.daysRemaining} days remaining`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #070B47; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .alert-box { background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>IT Inventory Management System</h1>
            <p>National Group India</p>
          </div>
          <div class="content">
            <div class="alert-box">
              <h2>🔔 Software License Expiry Alert</h2>
              <p>The following software license is expiring soon:</p>
            </div>
            <p><strong>Software:</strong> ${data.softwareName}</p>
            <p><strong>Vendor:</strong> ${data.vendor}</p>
            <p><strong>Total Licenses:</strong> ${data.totalLicenses}</p>
            <p><strong>Expiry Date:</strong> ${data.expiryDate.toLocaleDateString('en-IN')}</p>
            <p><strong>Days Remaining:</strong> ${data.daysRemaining}</p>
            <p>Please initiate the renewal process to avoid service interruption.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from IT Inventory Management System</p>
            <p>© ${new Date().getFullYear()} National Group India. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Helper function to send request notification
export async function sendRequestNotification(request: {
  requestNumber: string;
  title: string;
  description: string;
  priority: string;
  requesterName: string;
  requesterEmail: string;
  companyName: string;
}) {
  const itTeamEmail = process.env.IT_TEAM_EMAIL || 'it@nationalgroupindia.com';
  
  const template = emailTemplates.newRequest({
    requestNumber: request.requestNumber,
    title: request.title,
    requesterName: request.requesterName,
    requesterEmail: request.requesterEmail,
    company: request.companyName,
    priority: request.priority,
    description: request.description,
  });

  return sendEmail({
    to: [itTeamEmail, request.requesterEmail],
    subject: template.subject,
    html: template.html,
  });
}

// Helper function to send status update notification
export async function sendStatusUpdateNotification(request: {
  requestNumber: string;
  title: string;
  status: string;
  requesterName: string;
  requesterEmail: string;
  comments?: string;
}) {
  const template = emailTemplates.requestStatusUpdate({
    requestNumber: request.requestNumber,
    title: request.title,
    status: request.status,
    requesterName: request.requesterName,
    comments: request.comments,
  });

  return sendEmail({
    to: request.requesterEmail,
    subject: template.subject,
    html: template.html,
  });
}
