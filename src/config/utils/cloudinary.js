const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const multer = require('multer')
const router = require('express').Router()
const {protect, authorize} = require('../../../middlewares/auth_middleware')


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: 'job_resumes',
        format: async (req, file) => file.mimetype.split('/')[1], 
        public_id: (req, file) => `${Date.now()}-${file.originalname}-resume`, 
    }
})

const upload = multer({storage})

router.post(
    '/apply',
    protect,
    authorize('jobseeker'),
    upload.single('resume'), // upload the resume first
    async (req, res) => {
        try {
            const { jobId, coverLetter } = req.body;
            const resumeUrl = req.file.path; // Cloudinary URL

            // Check if job exists and is active
            const job = await Job.findById(jobId);
            if (!job || !job.active) {
                return res.status(404).json({ message: 'Job not available' });
            }

            // Prevent duplicate applications
            const exists = await Application.findOne({
                job: jobId,
                applicant: req.user._id
            });
            if (exists) {
                return res.status(400).json({ message: 'Already applied' });
            }

            // Create the application
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