const express = require('express')
const router = express.Router()
const { register, login } = require('../Controllers/auth_controller')
const validate = require('../middlewares/validate_middleware')
const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('jobseeker','employer').required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

module.exports = router 