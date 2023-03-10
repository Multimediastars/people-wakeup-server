const aws = require('aws-sdk')
const multer = require('multer');
const sharp = require('sharp');
const multerS3 = require('multer-s3-transform');
// const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { addCeroBefore } = require('../helpers/addCeroBefore');



const { S3_ENDPOINT, BUCKET_NAME } = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT)
const s3 = new aws.S3({
    endpoint: spacesEndpoint
})


const uploady = multer({
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
                let fecha = new Date()
                let fechaFull = addCeroBefore(fecha.getDate()) + "-" + addCeroBefore(fecha.getMonth() + 1) + "-" + Date.now() || Date.now()
                // let fullPath = `reports/original/${fecha.getFullYear()}/${addCeroBefore(fecha.getMonth() + 1)}/` + fechaFull;
                let fullPath = `test/original/${fecha.getFullYear()}/${addCeroBefore(fecha.getMonth() + 1)}/` + fechaFull;
                cb(null, fullPath + path.extname(file.originalname))
            },
            transform: function (req, file, cb) {
                // cb(null, sharp())
                cb(null, sharp()
                    // .resize({ width: 1000 })
                    .resize({ width: 1000, height: 1000, fit: sharp.fit.inside })
                    .jpeg({ quality: 70 })
                )

            }
        }, {
            id: 'thumbnail',
            key: (req, file, cb) => {
                let fecha = new Date()
                let fechaFull = addCeroBefore(fecha.getDate()) + "-" + addCeroBefore(fecha.getMonth() + 1) + "-" + Date.now() || Date.now()
                // let fullPath = `reports/thumbnail/${fecha.getFullYear()}/${addCeroBefore(fecha.getMonth() + 1)}/` + fechaFull;
                let fullPath = `test/thumbnail/${fecha.getFullYear()}/${addCeroBefore(fecha.getMonth() + 1)}/` + fechaFull;
                cb(null, fullPath + path.extname(file.originalname))
            },
            transform: function (req, file, cb) {
                cb(null, sharp()
                    .resize({ width: 300, height: 300, fit: sharp.fit.inside })
                    .jpeg({ quality: 50 })
                )
            }
        }],

        acl: 'public-read',

    })
}).array('uploady', 15)


module.exports = { uploady, s3 }