const { response } = require("express");
const cloudinary = require('../helpers/cloudinary')
const fs = require('fs-extra')
const path = require('path')

const New = require('../models/news.model');

const { generateJWT } = require("../helpers/generar-jwt");

const PAGE_SIZE = 50


// Get All News
const getAllNews = async (req, res = response) => {

    const page = Number(req.query.page || "1")
    const pageSize = PAGE_SIZE || 50

    // const allNews = await New.find()

    try {

        const [total, allNews] = await Promise.all([
            New.countDocuments(),
            New.find()
                .sort({ date: -1 })
                .limit(pageSize)
                .skip((Math.max(0, page - 1) * pageSize))
        ]);


        res.json({
            ok: true,
            page,
            totalPages: Math.ceil(total / pageSize),
            allNews
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }
}


// Get Single News
const getSingleNews = async (req, res = response) => {

    const { id } = req.params

    try {

        const [singleNews, otherNews] = await Promise.all([
            New.findById(id),
            New.find({ _id: { $nin: id } })
                .sort({ date: -1 })
                .limit(5)
        ])

        res.status(200).json({
            ok: true,
            singleNews,
            otherNews
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'Something went wrong'
        })
    }

}



// Create Post
const createNews = async (req, res = response) => {

    const { title, description, mediaType = "image", videoFile = null } = req.body
    const file = req.file

    let activeNews = {
        title,
        description,
        mediaType: videoFile ? "video" : "image",
        videoFile,
        author: req.uid
    }

    if (file) {

        try {
            const results = await cloudinary.uploader.upload(file.path, {
                upload_preset: 'news',
                transformation: { width: 1200, crop: "scale" },
                quality: "auto",
                format: "jpg"
            })

            activeNews.cover = results.secure_url

            await fs.unlink(file.path)
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                ok: false,
                error
            })
        }
    }


    const news = new New(activeNews)
    await news.save()

    res.status(200).json({
        ok: true,
        news,
    })
}



module.exports = {
    getAllNews,
    getSingleNews,
    createNews,
}