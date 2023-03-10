const mongoose = require('mongoose')

const connectedDB = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log('DB Online')
        
    } catch (error) {
        console.log(error)
        throw new Error('Error in the Database')
    }
}

module.exports = {
    connectedDB
}