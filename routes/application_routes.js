const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Job = require('../models/job')
const Application = require('../models/application')
const { protect, authorize } = require('../middlewares/auth_middleware');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

console.log('Cloudinary connected to:', process.env.CLOUD_NAME);

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job_resumes',
    format: async (req, file) => file.mimetype.split('/')[1],
    public_id: (req, file) => `${Date.now()}-${file.originalname}-resume`
  }
});

const upload = multer({ storage });

router.post(
  '/apply',
  protect,
  authorize('jobseeker'),
  upload.single('resume'),
  async (req, res) => {
    try {
      const { jobId, coverLetter } = req.body;
      const resumeUrl = req.file.path; // Cloudinary URL

      const job = await Job.findById(jobId);
      if (!job || !job.active) {
        return res.status(404).json({ message: 'Job not available' });
      }

      const exists = await Application.findOne({
        job: jobId,
        applicant: req.user._id
      });
      if (exists) {
        return res.status(400).json({ message: 'Already applied' });
      }

      const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        coverLetter,
        resumeUrl
      });

      res.status(201).json(application);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
