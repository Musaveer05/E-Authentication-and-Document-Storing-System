const convertApi = require('convertapi')(process.env.PDFAPI);

module.exports.downloadPdf = async(req,res) =>{

    try {
        const {imageID} = req.body;
        const result = await convertApi.convert('pdf', {
            File: `${imageID}`,
        }, 'jpg');

        return res.redirect(result.response.Files[0].Url);

    } catch (error) {
        
        req.flash('deleted', 'Error Downloading the image');
        return res.redirect('/UserProfile/ViewDocuments');

    }
}