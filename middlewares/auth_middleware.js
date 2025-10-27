const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken')
const user = require('../models/User')

const protect = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization 
    if (authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(' ')[1]
    }
    if (!token) return res.status(401).json({message: 'NOT AUTHORIZED'});
    
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = await user.findById(decoded.id).select('-password')
        next()
    } catch (err){
        res.status(401).json({message: 'Token invalid'})
    }
}

const authorize = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) return res.status(403).json({message: 'Forbidden'})
    next()
}

module.exports = {protect, authorize}
