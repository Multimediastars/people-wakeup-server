const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = ( req, res = response, next ) => {

    // x-token headers
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: `There's no token on the petition`
        });
    }

    try {
        
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRETO_JWT_PRIVATEKEY
        );

        req.uid = uid;
        req.name = name;


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Not a valid Token'
        });
    }

    next();
}


module.exports = {
    validarJWT
}
