const express = require('express')
const router = express.Router()
const appCtrl = require('../Controllers/application_controller')
const {protect, authorize} = require('../middlewares/auth_middleware')

router.post('/apply', protect, authorize('jobseeker'), appCtrl.apply)
router.get('/employer', protect, authorize('employer'), appCtrl.getApplications_foremployer)
router.get('/me', protect, authorize('jobseeker'), appCtrl.getApplications_forapplicant)
router.patch('/:id/status', protect, authorize('employer'), appCtrl.updateApplicationStatus)

module.exports = router