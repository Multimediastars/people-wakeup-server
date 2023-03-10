const { model, Schema } = require('mongoose')

const NewsSchema = Schema({

    title: {
        type: String,
        required: [true, 'Name is required']
    },

    description: {
        type: String,
        required: [true, 'Description is required']
    },

    cover: {
        type: String,
        // default: 'https://res.cloudinary.com/people-wake-up/image/upload/v1677610370/cld-sample-5.jpg',
        default: 'https://res.cloudinary.com/people-wake-up/image/upload/v1678220079/news/news_no-image-available_zxfn9j.jpg',
    },

    mediaType: {
        type: String,
        default: 'image',
    },

    videoFile: {
        type: String,
        default: null,
    },

    likes: {
        type: Number,
        default: 0,
    },

    topics: {
        type: Array,
        default: []
    },

    category: {
        type: Array,
        default: []
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },

    date: {
        type: Date,
        require: true,
        default: Date.now
    }

}, {
    versionKey: false,
})


module.exports = model('New', NewsSchema)