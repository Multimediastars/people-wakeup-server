const { model, Schema } = require('mongoose')

const UserSchema = Schema({

    name: {
        type: String,
        required: [true, 'Name is required']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required']
    },
    profile: {
        type: String,
        default: 'https://q-care-space.ams3.digitaloceanspaces.com/users/no-user.jpg',
        // default: 'https://res.cloudinary.com/growers-packers/image/upload/v1629145845/users/defaultUser1234.jpg',
    },
    rol: {
        type: String,
        required: [true, 'Rol is required']
    },
    active: {
        type: Boolean,
        default: true
    },

}, {
    versionKey: false,
})

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject()
    user.uid = _id
    return user
}


module.exports = model('User', UserSchema)