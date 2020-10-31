const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../module/file')
const {v4: uuidv4} = require('uuid')

let storage = multer.diskStorage({
    destination : (req, file, cb) => cb(null, 'uploads/'),
    filename : (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit : { fileSize : 1000000 * 100},
}).single('myfile');

router.post('/', (req, res) => {

    //Store file 
    upload(req, res, async (err) => {
        //Validate Request
        if(!req.file){
            return res.json({error : 'Invalid File'})
        }

        if(err){
            return res.status(500).send({error : err.message})
        }
        //Store in DB
        const file = new File({
            filename : req.file.filename,
            uuid : uuidv4(),
            path : req.file.path,
            size : req.file.size
        });

        const response = await file.save();
        return res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`})
    })

})

router.post('/send', async (req, res) => {

    const {uuid, emailFrom, emailTo} = req.body

    //Check for empty fields
    if(!uuid || !emailFrom || !emailTo){
        return res.status(422).status({error : 'All fields are required'})
    }

    const file = await File.findOne({uuid : uuid})

    //Check if sender already exists
    if(file.sender){
        return res.status(422).status({error : 'Email already sent'})
    }

    file.sender = emailFrom
    file.receiver = emailTo
    const response = await file.save()

    //Send email
    const sendMail = require('../services/emailServices');
    sendMail({
        from : emailFrom,
        to : emailTo,
        subject : 'WebDrop File Sharing',
        text : `${emailFrom} shared a file with you`,
        html : require('../services/emailTemplate')
        ({
            emailFrom : emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size : parseInt(file.size/1000) + ' KB',
            expires : '24 hrs'
        })
    })
    return res.send({success : true})
})

module.exports = router