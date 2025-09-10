import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow GET requests (for viewing submissions)
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // This would require authentication in production
    const submissionsFile = path.join(process.cwd(), 'data', 'submissions.json');
    
    if (!fs.existsSync(submissionsFile)) {
      return res.status(200).json({ submissions: [] });
    }

    const submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
    
    // Return submissions (in production, add pagination and filtering)
    return res.status(200).json({ 
      submissions: submissions.slice(-50), // Last 50 submissions
      total: submissions.length 
    });

  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Helper function to save submissions to file
export function saveSubmission(submissionData) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const submissionsFile = path.join(dataDir, 'submissions.json');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    let submissions = [];
    if (fs.existsSync(submissionsFile)) {
      submissions = JSON.parse(fs.readFileSync(submissionsFile, 'utf8'));
    }

    // Add new submission with timestamp and ID
    const newSubmission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...submissionData
    };

    submissions.push(newSubmission);

    // Save to file
    fs.writeFileSync(submissionsFile, JSON.stringify(submissions, null, 2));
    
    return newSubmission;
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }
}