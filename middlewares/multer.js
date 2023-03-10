const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path')


const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/uploads'),
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        //reject file
        cb({ message: 'Unsupported file format' }, false)
    }
}

var upload = multer({
    storage: storage,
    limits: { fileSize: 50000 * 50000 },
    fileFilter: fileFilter
})

module.exports = upload