const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password cannot be blank']
    },
    dob: {
        type: String,
        required: true
    },
    privateKey:{
        type: String,
        required: true
    },
    publicKey:{
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    }

})

module.exports = mongoose.model('User', userschema);