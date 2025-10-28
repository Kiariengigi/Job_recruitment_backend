const mongoose = require('mongoose')

const connectDB = async (mongoUri) => {
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    })
    console.log('MongoDB Connected!')
}

module.exports = connectDB