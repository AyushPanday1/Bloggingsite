const Authormodel = require('../model/Authormodel')
// const mongoose = require('mongoose');
const { isValidObjectId } = require("mongoose");
const { findById } = require('../model/Authormodel');
const blogModel = require('../model/blogmodel')





//2nd- post API------------------------------------------------------------------------------------------------

const createBlog = async function (req, res) {

    try {
        let authorID = req.body.authorID
        let blog = req.body
        if (!authorID) {
            return res.status(400).send({ status: false, msg: "AuthorId must be present" })
        }
        if (!isValidObjectId(authorID)) {
            return res.send("authorid is not valid")
        }

        let available = await Authormodel.findById(authorID)
        if (!available) {
            return res.status(400).send({ status: false, msg: "Authorid not found" })
        }
        let savedBlog = await blogModel.create(blog)
        res.status(201).send({ status: true, msg: savedBlog })
    }
    catch (error) {
        res.status(400).send({ msg: error })
        console.log({ msg: error })
    }
};


//3rd- get blog API---------------------------------------------------------------------------------------

const getBlog = async function (req, res) {
    try {
        const { authorID, category, tags, subcategory } = req.query

        let data = {

            isDeleted: false,
            isPublished: true,

        }
        if (authorID) {
            data.authorID = authorID
        }
        if (category) {
            data.category = category
        }

        if (tags) {
            data.tags = tags
        }
        if (subcategory) {
            data.subcategory = subcategory
        }


        const result = await blogModel.find(data)

        if (result) {
            res.status(201).send({ msg: result })
        }
        else {
            res.status(404).send({ msg: "No data found" })
        }

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//4th - PUT /blogs/:blogId--------------------------------------------------------------------------------


const updateAllBlogs = async function (req, res) {
    try {
        const blogId1 = req.params.blogId
        if (!isValidObjectId(blogId1)) {
            return res.send("BlogId is not valid")
        }
        let available = await blogmodel.findById(blogId1)
        if (!available) {
            return res.status(400).send({ status: false, msg: "BlogId not found" })
        }
        const { title, body, tags, subcategory } = req.body
        const findBlog = await blogmodel.findById(blogId1)
        const tagsData = findBlog.tags
        const subcategryData = findBlog.subcategory
        tagsData.push(tags)
        subcategryData.push(subcategory)


        const blogData = await blogmodel.findByIdAndUpdate(blogId1, {
            $set: {
                title: title,
                body: body,
                tags: tagsData,
                subcategory: subcategryData,
                isPublished: true

            }
        }, { new: true })
        return res.status(200).send({ msg: blogData })
    }
    catch (error) {
        res.status(400).send({ msg: error })
        console.log({ msg: error })
    }
};




// 5th- DELETE /blogs/:blogId--------------------------------------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            res.status(400).send({ msg: "invalid blogId" })
        }
        let blog = await blogmodel.find({ isDeleted: false, _id: blogId })
        if (!blog) {
            return res.status(400).send({ status: false, msg: "BlogId not found" })
        }

        let saveData = await blogmodel.updateOne({ isDeleted: false, _id: blogId }, { isDeleted: true }, { new: true })  //in this line first we find the isdeleted:false & then we update it
        res.status(200).send({ msg: saveData })
    }
    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


// 6th -DELETE /blogs?queryParams---------------------------------------------------------------------------

const DeleteByQuery = async function (req, res) {
    try {
        let data = req.query


        let { authorID, tags, category, subcategory, isPublished } = data
        if(!isValidObjectId(authorID)) return res.send({msg:"Authorid is in valid"})

        if (!(authorID || tags || category || subcategory || isPublished)) {
            return res.status(400).send({ status: false, msg: "Please pass any query" })
        }
        

        let blog = await blogmodel.findOne({ $or: [{ authorID: authorID }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] })

        if (!blog) return res.status(404).send({ status: false, msg: "False" })

        let blogDetails = await blogmodel.updateMany({ $and: [{ isDeleted: false }, { $or: [{ authorID: authorID }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] }] },
            { $set: { isDeleted: true } })

        if (blogDetails.modifiedCount == 0 || blogDetails.matchedCount == 0) {
            return res.status(404).send({ status: false, msg: "No blog found" })
        }

        res.status(200).send({ status: true, msg: "Blog deleted" })

    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

module.exports.getBlog = getBlog
module.exports.createBlog=createBlog;
module.exports.DeleteByQuery = DeleteByQuery
module.exports.deleteBlog = deleteBlog
module.exports.updateAllBlogs = updateAllBlogs
