const Authormodel = require('../model/Authormodel')             // Importing Authormodel from authormodel.js module
const blogModel = require('../model/blogmodel')                 // Importing blogmodel   from  blogmodel.js  module

const mongoose = require('mongoose')
const { isValidObjectId } = require("mongoose");                // Inbuilt function of mongoose to check any id is valid object id or not


//2nd- post API------------------------------------------------------------------------------------------------

let createBlog = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, tags, subcategory } = data
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide all the required data" })
        }
        if (!title || title == "") {
            return res.status(400).send({ status: false, msg: "please enter title" })
        }

        if (!body || body == "") {
            return res.status(400).send({ status: false, msg: "please enter body" })
        }

        if (!authorId || authorId == "") {
            return res.status(400).send({ status: false, msg: "please enter authorId" })
        }

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, msg: "invalid authorId" })
        }
        let authorDetail = await Authormodel.findById(authorId)
        if (!authorDetail) {
            return res.status(400).send({ status: false, msg: "authorId is not present" })
        }
        if (!tags || tags == "") {
            return res.status(400).send({ status: false, msg: "please enter tags" })
        }
        if (!subcategory || subcategory == 0) {
            return res.status(400).send({ status: false, msg: "subcategory is required" })
        }
        if (data.isPublished === true)
            data.publishedAt = Date.now()

        let savedData = await blogModel.create(data)
        return res.status(200).send({ status: true, msg: "blog successfully created ", data })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



//3rd- get blog API---------------------------------------------------------------------------------------



const getBlog = async function (req, res) {
    try {
        const filteredBlog = await blogModel.find({ isDeleted: false, isPublished: true })
        if (filteredBlog.length == 0 || !filteredBlog) {
            return res.status(404).send({ status: false, msg: "no data found" })
        }
        else if (filteredBlog) {
            let queryParams = req.query

            if (Object.keys(queryParams).length == 0) {
                return res.status(400).send({ status: false, msg: "no query data found" })
            }
            const data = await blogModel.find(queryParams)
            if (!data || data.length == 0) {
                return res.status(400).send({ status: false, msg: "ques data not found" })
            }
            return res.status(200).send({ status: true, msg: "some data found ", filteredBlog })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



//4th - PUT /blogs/:blogId--------------------------------------------------------------------------------


const updateAllBlogs = async function (req, res) {
    try {
        let data = req.body
        let blogId = req.params.blogId

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "request body can't not be blank" })
        }
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "invalid blogId" })
        }
        if (!blogId) {
            return res.status(400).send({ status: false, msg: "blogId is required " })
        }
        let blogDetails = await blogModel.findById(blogId)
        if (!blogDetails) {
            return res.status(400).send({ status: false, msg: "blogId is invalid" })
        }
        if (blogDetails._id != blogId) {
            return res.status(400).send({ status: false, msg: "blogDetails not found" })
        }
        if (blogDetails.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "blog is already deleted" })
        }
        if (blogDetails.isDeleted == false) {
            let updateBlogs = await blogModel.findByIdAndUpdate({ _id: blogId }, {
                $set: {
                    title: data.title,
                    body: data.body,
                    isPublished: true,
                    publishedAt: Date.now()
                },
                $push: {
                    tags: data.tags,
                    subcategory: data.subcategory
                },
            }, { new: true, upsert: true })
            return res.status(200).send({ status: true, msg: "blog updated successfully", updateBlogs })


        }
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }

}

// 5th- DELETE /blogs/:blogId--------------------------------------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "blogId is not valid" })
        }
        let data = await blogModel.findById(blogId)
        if (!data) {
            return res.status(400).send({ status: false, msg: "blogId is required(id doesn't exist)" })
        }
        if (data) {
            if (data.isDeleted == false) {
                await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
                return res.status(200).send({ status: true, msg: "blog deleted successfully" })
            } else {
                return res.status(200).send({ status: true, msg: "blog already deleted" })
            }

        }
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}




// 6th -DELETE /blogs?queryParams---------------------------------------------------------------------------


const DeleteByQuery = async function (req, res) {
    try {
        const queryData = req.query

        // checking data is coming from query 
        if (Object.keys(queryData).length == 0) {
            return res.status(400).send({ status: false, msg: "enter some data in query" })
        }

        const alldata = await blogModel.find({ $and: [queryData, { isDeleted: false }, { isPublished: true }] })

        if (alldata.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "Blog is already deleted" })
        }
        if (alldata.length == 0) {
            return res.status(400).send({ status: false, msg: "length is 0" })
        }

        if (!alldata) {
            return res.status(400).send({ status: false, msg: "no data with this query" })
        } else {
            const deleteData = await blogModel.updateMany(queryData, { $set: { isDeleted: true, deletedAt: new Date(), isPublished: false } }, { new: true })

            return res.status(200).send({ status: true, msg: "data succesfully deleted" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// Exporting all the functions from here -------------------------------------------------------------

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog
module.exports.updateAllBlogs = updateAllBlogs
module.exports.deleteBlog = deleteBlog
module.exports.DeleteByQuery = DeleteByQuery
