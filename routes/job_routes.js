const express = require('express')
const router = express.Router()
const jobCtrl = require('../Controllers/job_controller')
const {protect, authorize} = require('../middlewares/auth_middleware')

router.get('/', jobCtrl.getJobs)
router.get('/:id', jobCtrl.getJob_byid)
router.post('/', protect, authorize('employer'), jobCtrl.createJob)
router.put('/:id', protect, authorize('employer'), jobCtrl.updateJob)
router.delete('/:id', protect, authorize('employer'), jobCtrl.deleteJob)

module.exports = router
