const User = require('../models/users.model')
const New = require('../models/news.model')
const Role = require('../models/roles.model')


const emailExist = async (email = '') => {

    const existEmail = await User.findOne({ email })

    if (existEmail) {
        throw new Error(`The email ${email} is already taken`)
    }
}

const contactExist = async (email = '') => {

    const existContact = await User.findOne({ 
        "contacts.email" : email
    })

    if (existContact) {
        throw new Error(`The email ${email} is already taken`)
    }
}



const rolExist = async (rol = '') => {

    const existRol = await Role.findOne({ rol })

    if (!existRol) {
        throw new Error(`The rol ${rol} is not valid`)
    }
}



const idUserExist = async (id) => {

    const existeUser = await User.findById(id)

    if (!existeUser) {
        throw new Error(`The id ${id} doesn't exist`)
    }
}


const idNewstExist = async (id) => {

    const existeNews = await New.findById(id)

    if (!existeNews) {
        throw new Error(`The id ${id} doesn't exist`)
    }
}


module.exports = {
    emailExist,
    rolExist,
    idUserExist,
    contactExist,
    idNewstExist
}