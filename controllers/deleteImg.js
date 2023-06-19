const Data = require('../models/data')
const { cloudinary } = require('../cloudinary/config');

module.exports.deleteImg = async(req,res)=>{

    try {
        const {imageurl} = req.body;

        const id = req.session.user_id;
        if(!id) throw new Error('error');

        const deleteResult = await cloudinary.uploader.destroy(imageurl);

        if(deleteResult) console.log('Image deleted from cloudinary');

        const deletefromDb = await Data.updateOne({ _id: id }, { $pull: { images: { filename: imageurl } } });

        if(deletefromDb.acknowledged) console.log('Deleted From DB')
        else console.log('Failed to delete from DB')

        req.flash('deleted', 'Image Successfully Deleted');
        res.redirect('/UserProfile/viewDocuments')

    } catch (error) {
        
        res.redirect('/login');

    }

}