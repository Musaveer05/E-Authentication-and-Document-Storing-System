const NodeRSA = require('node-rsa');
const UserData = require('../models/user');
const Data = require('../models/data');

module.exports.viewDocs = async (req, res) => {

    try {

        const id = req.session.user_id;
        const user = await UserData.findById(id);
        const getData = await Data.findById(id);

        const key = new NodeRSA(user.privateKey);

        getData.images.forEach(index => {
            index.path = key.decrypt(index.path, 'utf8');
        });

        const credentials = getData.images;

        res.render('viewDocument', { credentials, messages: req.flash('deleted') });

    }
    catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }

}