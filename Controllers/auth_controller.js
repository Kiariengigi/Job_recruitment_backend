const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN})

exports.register = async (req, res) => {
    const {name, email, password, role} = req.body 
    const exists = await User.findOne({email})
    if (exists) return res.status(400).json({message: 'Email already registered'})
    const user = await User.create({name, email, password, role})
    res.status(201).json({ token: generateToken(user.id), user:{id: user._id, email: user.email, role: user.role}})
}
exports.login = async (req, res) => {
    const {email, password} = req.body 
    const user = await User.findOne({email}).select('+password')
    if (!user) return res.status(401).json({message: 'Invalid Credentials'})
    const isMatch = await user.matchpass(password)
    if (!isMatch) return res.status(401).json({message: 'Invalid credentials'})
    res.json({ token: generateToken(user._id), user:{id: user._id, email: user.email, role: user.role}})
}