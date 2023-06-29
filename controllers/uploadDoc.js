const NodeRSA = require('node-rsa')
const Data = require('../models/data')
const User = require('../models/user')

module.exports.getUploadForm =  (req, res) => {
    res.render('UploadDocument')
}

module.exports.postUploadForm = async (req, res) => {

    try {
        const userId = req.session.user_id;
        console.log("user_id is ", userId);
        const user = await User.findById(userId);
        console.log("user is ", user);
        if (!user) {
            throw new Error('Threat');
        }

        const existingData = await Data.findOne({ user: userId });
        const key = new NodeRSA(user.publicKey);

        const arr = req.files.map((file)=>{
            return {
                filename: file.filename,
                path: key.encrypt(file.path, 'base64')
            }
        })

        if (existingData) {
            console.log("Yes existing data ", existingData);
            const result = await Data.updateOne({ _id: userId }, { $push: { images: arr } });
            console.log("Update result:", result);
        } else {
            const data = new Data({
                _id: userId,
                email: user.email,
                images: arr,
            });
            await data.save();
        }

        req.flash('success', 'Photos Uploaded Successfully')
        res.redirect('/UserProfile');
    } catch (error) {

        if (error.message == 'Threat') {
            return res.redirect('/login');
        }
        
        req.flash('success', 'Error Uploading Images');
        console.log("Error in uploading images" ,error);
        res.redirect('/UserProfile');
    }
}
