const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const morgan = require('morgan')
const compression = require('compression')
const connectDB = require('./db')

const authRoutes = require('../../routes/auth_routes')
const jobRoutes = require('../../routes/job_routes')
const applicationRoutes = require('../../routes/application_routes')

const app = express()
connectDB(process.env.MONGO_URI)

app.use(helmet())
app.use(cors())
app.use(express.json({limit: '10kb'}))
app.use((req, _res, next) => {
	Object.defineProperty(req, 'query', {
		...Object.getOwnPropertyDescriptor(req, 'query'),
		value: req.query,
		writable: true,
	})

	next()
})
app.use(mongoSanitize())
app.use(xss())
app.use(compression())
app.use(morgan('combined'))

const limiter = rateLimit({windowMs: 15*60*1000, max:100})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)

app.use((req, res) => res.status(404).json({message: 'Not found'}))

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT} `))
