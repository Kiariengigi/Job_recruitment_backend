const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const usersSchema = new Schema({
    name:{type: String, required: true, trim: true}, 
    email:{type: String, required: true, unique: true, lowercase: true, trim: true}, 
    password:{type: String, required: true, select: false}, 
    role:{type: String, enum: ['jobseeker', 'employer', 'admin'], default: 'jobseeker'}, 
    skills: {String}, 
    resumeUrl: String, 
}, {timestamps: true}); 

usersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
});

usersSchema.methods.matchpass = function(candidate){
    return bcrypt.compare(candidate, this.password)
}

const user = mongoose.model('User', usersSchema)
console.log("User model created successfully")

module.exports = user