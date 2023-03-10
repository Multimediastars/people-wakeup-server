const { Router } = require('express')
const upload = require('../middlewares/multer')
const userUpload = require('../middlewares/multer-user')
const { check } = require('express-validator')

const { getAllNews, getSingleNews, createNews } = require('../controllers/news.controller')

const { idUserExist, idNewstExist } = require('../helpers/db-validators')
const validarCampos = require('../middlewares/validar-campos')
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router()


router.get('/', getAllNews)

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(idNewstExist),
    validarCampos,
],getSingleNews)


router.post('/create-news', [
    validarJWT,
    // check('title', 'Title is required').not().isEmpty(),
    // check('description', 'Description is required').not().isEmpty(),
    upload.single('cover'),
    validarCampos
], createNews)



module.exports = router