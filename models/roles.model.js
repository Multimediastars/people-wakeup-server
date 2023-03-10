const { model, Schema } = require('mongoose')

const RoleSchema = Schema({

    rol:{type:String},

},{ 
    versionKey: false, 
    }
)

module.exports = model('Role', RoleSchema)