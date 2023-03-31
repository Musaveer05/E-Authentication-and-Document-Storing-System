const mongoose = require('mongoose');

const emailOtpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    emailOtp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Number,
        required: true
    },
    expiresAt:{
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('EmailOtp', emailOtpSchema);