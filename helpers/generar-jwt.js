
const jwt = require('jsonwebtoken')


const generateJWT = ( uid, name ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, name }

        jwt.sign( payload, process.env.SECRETO_JWT_PRIVATEKEY, {
            expiresIn: "72h"
        }, (err, token) => {
            if(err){
                console.log(err);
                reject(`token wasn't generated`)
            } else {
                resolve( token )
            }
        })

    })
}


module.exports = {
    generateJWT
}

