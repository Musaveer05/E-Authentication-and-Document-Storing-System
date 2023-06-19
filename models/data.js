const mongoose = require('mongoose');

const Credentials = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    images: [
        {
            filename:{
                type:String,
                required:true
            },
            path:{
                type:String,
                required:true
            }
        }
    ]

})

module.exports = mongoose.model('data', Credentials);