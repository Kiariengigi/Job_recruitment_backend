const Job = require('../models/job')

exports.createJob = async (req, res) => {
    const job = await Job.create({...req.body, employer: req.user._id})
    res.status(201).json(job)
}

exports.getJobs = async (req, res) => {
    const {q, location, industry, skills, page = 1, limit = 10} = req.query
    const filter = {active: true} 
    if (location) filter['location.city'] = new RegExp(location, 'i')
    if (skills) filter.skills = {$in: skills.split(',')}
    let query = Job.find(filter)
    if (q) query = query.find({$text: {$search: q}}); 
    const results = await query
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .populate('employer', 'name email')
    res.json(results)
}

exports.getJob_byid = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('employer', 'name email')
    if (!job) return res.status(404).json({message: 'Not found'})
    res.json(job)
}
exports.updateJob = async (req, res) => {
    const job = await Job.findOneAndUpdate({_id: req.params.id, employer: req.user._id}, req.body, {new: true})
    if (!job) return res.status(404).json({message: 'Not found or not authorized'})
    res.json(job)
}
exports.deleteJob = async (req, res) => {
    const job = await Job.findOneAndDelete({_id: req.params.id, employer: req.user._id})
    if (!job) return res.status(404).json({message: 'Not found or not authorized'})
    res.json({message: 'Job deactivated'})
}