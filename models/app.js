const path = require('path')
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const mongoose = require('mongoose');
const app = express(); 

const mongoURI = process.env.MONGO_URI
console.log(process.env.PORT)

mongoose.connect(
    mongoURI,

{
    useNewUrlParser: true, 
    UseUnifiedTopology: true
}
)
.then(success => {
    console.log('Connected to MongoDB'); 
    app.listen(process.env.PORT, () => {
        console.log('Server listening at: ' + process.env.PORT)
    });
})
.catch(error => {
    console.log('Error in connection ' + error)
});

