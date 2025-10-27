const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new mongoose.Schema({
    job: {type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true}, 
    applicant: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    coverLetter: String, 
    resumeUrl: String, 
    status: {type: String, enum: ['applied', 'viewed', 'shortlisted', 'rejected', 'hired'], default: 'applied'}, 
}, {timestamps: true})

module.exports = mongoose.model('Application', applicationSchema)