const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

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

module.exports = {cloudinary, storage}; 