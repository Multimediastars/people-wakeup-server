const aws = require('aws-sdk')
const multer = require('multer');
const sharp = require('sharp');
const multerS3 = require('multer-s3-transform');
const path = require('path');


const { S3_ENDPOINT, BUCKET_NAME } = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT)
const s3 = new aws.S3({
    endpoint: spacesEndpoint
})


const userUpload = multer({
    limits: { fieldSize: 2 * 1024 * 1024 },
    storage: multerS3({
        limits: { fieldSize: 2 * 1024 * 1024 },
        s3,
        bucket: BUCKET_NAME,
        shouldTransform: function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype))
        },

        transforms: [{
            id: 'original',
            key: (req, file, cb) => {
                let date = Date.now()
                let name = req.name.toLowerCase().split(" ").join("").trim()
                cb(null, "users/" + name + "-" + date + path.extname(file.originalname));
            },
            transform: function (req, file, cb) {
                cb(null, sharp()
                    .resize({ width: 1000, height: 1000, fit: sharp.fit.cover })
                    .jpeg({ quality: 60 })
                )
            }
        }],

        acl: 'public-read',

    })
}).single('userUpload')


module.exports =  userUpload