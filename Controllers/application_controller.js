const Application = require('../models/application')
const job = require('../models/job')

exports.apply = async (req, res) => {
  try {
    // req.body will contain text fields (jobId, coverLetter)
    const { jobId, coverLetter } = req.body;
    const resumeUrl = req.file?.path; // ✅ uploaded file from Cloudinary

    if (!jobId || !resumeUrl) {
      return res.status(400).json({ message: 'Job ID and resume are required.' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job || !job.active) {
      return res.status(404).json({ message: 'Job not available' });
    }

    // Prevent duplicate applications
    const exists = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (exists) {
      return res.status(400).json({ message: 'Already applied' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resumeUrl,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getApplications_foremployer = async (req, res) => {
    const jobs = await Job.find({employer: req.user._id}).select('_id')
    const jobIds = jobs.map(j => j._id)
    const applications = await Application.find({job: {$in: jobIds}}).populate('applicant', 'name email skills')
    res.json(applications)
}

exports.getApplications_forapplicant = async (req, res) => {
    const apps = await Application.find({applicant: req.user._id}).populate('job')
    res.json(apps)
}

exports.updateApplicationStatus = async (req, res) => {
    const app = await Application.findById(req.params.id).populate('job')
    if (!app) return res.status(404).json({message: 'Application not found'})
    if (String(app.job.employer) !== String(req.user._id)) return res.status(403).json({message: 'Not authorized'})
    app.status = req.body.status; 
    await app.save()
    res.json(app)
}