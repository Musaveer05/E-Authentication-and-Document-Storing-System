const mongoose = require('mongoose');

const Credentials = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    Aadhar: {
        type: String,
        required: true
    },
    DOB:{
        type: String,
        required: true,
    }

})

module.exports = mongoose.model('data', Credentials);