const { response } = require("express");
const bcryptjs = require('bcryptjs');
const aws = require('aws-sdk')

const User = require('../models/users.model');

const { generateJWT } = require("../helpers/generar-jwt");


const { S3_ENDPOINT, BUCKET_NAME } = process.env;

const spacesEndpoint = new aws.Endpoint(S3_ENDPOINT)
const s3 = new aws.S3({
    endpoint: spacesEndpoint
})


// Register
const register = async (req, res = response) => {

    const { name, lastname, email, password, rol } = req.body

    const user = new User({ name, email, password, lastname, rol })

    //Hash Password
    const salt = bcryptjs.genSaltSync()
    user.password = bcryptjs.hashSync(password, salt)

    await user.save()

    //Generate JWT
    const token = await generateJWT(user.id, user.name)

    res.json({
        token,
        ok: true,
        uid: user.id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        profile: user.profile,
        rol: user.rol
    })
}


// Login
const login = async (req, res = response) => {

    const { email, password } = req.body

    try {
        const user = await User.findOne({ email, active: true })

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "No user founded"
            })
        }

        //Matched password
        const matched = await bcryptjs.compareSync(password, user.password)

        if (!matched) {
            return res.status(400).json({
                ok: false,
                msg: "Password is not correct"
            })
        }

        //Generate JWT
        const token = await generateJWT(user.id, user.name)


        res.json({
            token,
            ok: true,
            name: user.name,
            email,
            lastname: user.lastname,
            uid: user.id,
            // phone: user.phone || "",
            profile: user.profile,
            rol: user.rol || null
        })
    } catch (error) {
        console.log(error) 
    }

}


const userUpdate = async (req, res = response) => {

    const { id } = req.params
    const { password, email, ...resto } = req.body
    const file = req.file

    const keyName = (url) => "users"+(url.toLowerCase().split("users")[1])

    if (file) {

        const { profile } = await User.findOne({ _id: id })
        const profileKey = keyName(profile)

        if (profileKey !== "users/no-user.jpg") {
            let params = {
                Bucket: BUCKET_NAME,
                Key: profileKey
            };

            s3.deleteObject(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else console.log(data);
            });
        }

        resto.profile = file.transforms[0].location
    } 

    // TODO validar contra DB
    if (password) {
        //Hash Password
        const salt = bcryptjs.genSaltSync()
        resto.password = bcryptjs.hashSync(password, salt)
    }

    const usuario = resto
    await User.findByIdAndUpdate(id, usuario)

    res.json({
        ok: true,
        usuario,
    })
}



const meToken = async (req, res = response) => {

    const { uid, name } = req;

    const user = await User.findOne({ _id: uid, active: true })

    if(!user){
        return res.status(400).json({
            ok: false,
            msg: "No user"
        })
    }

    // Generar JWT
    const token = await generateJWT(uid, name);

    res.status(201).json({
        token,
        ok: true,
        uid,
        email: user.email,
        name: user.name || "",
        lastname: user.lastname || "",
        profile: user.profile || "",
        rol: user.rol || null
    })

}



module.exports = {
    register,
    login,
    userUpdate,
    meToken,
}