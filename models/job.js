const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema({
    employer: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, 
    title: {type: String, required: true, text: true},
    description: {type: String, required: true}, 
    requirements: [String], 
    skills: [String], 
    industry: String, 
    location: {city: String, country: String}, 
    salaryRange: {min: Number, max: Number},
    employmentType: {type: String, enum: ['full-time', 'part-time', 'contract', 'internship']},
    active: {type: Boolean, default: true}
}, {timeStamp: true})

jobSchema.index({title: 'text', description: 'text', skills: 'text'})

module.exports = mongoose.model('job', jobSchema)