const Authormodel = require('../model/Authormodel')             // Importing Authormodel from authormodel.js module
const blogModel = require('../model/blogmodel')                 // Importing blogmodel   from  blogmodel.js  module

const mongoose = require('mongoose')
const { isValidObjectId } = require("mongoose");                // Inbuilt function of mongoose to check any id is valid object id or not


//2nd- post API------------------------------------------------------------------------------------------------

const createBlog = async function (req, res) {

    try {
        let authorID = req.body.authorID
        let blog = req.body
        if (!authorID) {
            return res.status(400).send({ status: false, msg: "AuthorId must be present" })
        }

        // Checking author id is valid or not ---------------------------------------------------------------
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
        res.status(500).send({ status:false,msg: error })
        console.log({ msg: error })
    }
};



//3rd- get blog API---------------------------------------------------------------------------------------

const getBlog = async function (req, res) {
    try {

        // Taking all queries in one object to reduce time  --------------------------------------------
        const { authorID, category, tags, subcategory } = req.query

        let data = {

            isDeleted: false,
            isPublished: true,

        }
        if (authorID) {
            data.authorID = authorID    //making a key named authorID and store the authorID
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
            res.status(201).send({ status:true,msg: result })
        }
        else {
            res.status(404).send({status:false, msg: "No data found" })
        }
    }
    catch (error) {
        res.status(500).send({status: false, msg: error.message })
    }
}


//4th - PUT /blogs/:blogId--------------------------------------------------------------------------------


const updateAllBlogs = async function (req, res) {
    try {
        let {authorID,category,isDeleted} = req.body   
        if((authorID||category||isDeleted)){                     //edge case if any of these entered in the body then it will through an error 
            res.status(400).send({status : false, msg : "Don't want these attributes"})
        }

        const blogId1 = req.params.blogId
        if (!isValidObjectId(blogId1)) {
            return res.send({status : false, msg:"BlogId is not valid"})
        }

        // Available is checking that the wanted data is available in our database or not--------------
        let available = await blogModel.findById(blogId1)

        if (!available) {
            return res.status(400).send({ status: false, msg: "BlogId not found" })
        }

        // Taking all attributes in one object to reduce time -----------------------------------------

        const { title, body, tags, subcategory } = req.body

        const findBlog = await blogModel.findById(blogId1)

        const tagsData = findBlog.tags
        const subcategryData = findBlog.subcategory

        // Adding New tags and subcategories in previous existing data(arrays)-----------------------
        tagsData.push(tags)
        subcategryData.push(subcategory)


        const blogData = await blogModel.findByIdAndUpdate(blogId1, {
            $set: {
                title: title,
                body: body,
                tags: tagsData,
                subcategory: subcategryData,
                isPublished: true

            }
        }, { new: true })
        return res.status(201).send({ status:true,msg: blogData })
    }
    catch (error) {
        res.status(500).send({ status: false,msg: error.message })
        console.log({ msg: error.message })
    }
};




// 5th- DELETE /blogs/:blogId--------------------------------------------------------------------------------

const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogId


        if (!isValidObjectId(blogId)) {
            res.status(400).send({ msg: "invalid blogId" })
        }

        let blog = await blogModel.find({ isDeleted: false, _id: blogId })

        if (!blog) {
            return res.status(400).send({ status: false, msg: "Blog not found" })
        }


        // beFore updating we pass the conditions that data should not be deleted and returning the updated data using new:true.
        let deletddata = await blogModel.findOneAndUpdate({ isDeleted: false, _id: blogId }, { isDeleted: true }, { new: true })

        res.status(201).send({ status : true , Refrence:deletddata , Message: "Deleted successfully!!"})
    }
    catch (err) {
        res.status(500).send({status: false, msg: err.message })
    }
}



// 6th -DELETE /blogs?queryParams---------------------------------------------------------------------------

const DeleteByQuery = async function (req, res) {
    try {

        let data = req.query


        let { authorID, tags, category, subcategory, isPublished , decodedToken } = data


        if (!(authorID || tags || category || subcategory || isPublished || decodedToken )) {
            return res.status(400).send({ status: false, msg: "Please pass any query" })
        }
        // As in the above data only author id is object id so validating it-----------------------------
        if (!isValidObjectId(authorID)) return res.status(400).send({ msg: "Authorid is invalid" })

        // $or means if any of the condition matches --------------------------------------------------
        let blog = await blogModel.findOne({ $or: [{ authorID: authorID }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished },{authorID:decodedToken}] })

        if (!blog) return res.status(404).send({ status: false, msg: "False" })


        //Before updating firstly we are checking it if data is deleted or not so only passing not deleted data--------------
        let blogDetails = await blogModel.updateMany({ $and: [{ isDeleted: false }, { $or: [{ authorID: authorID }, { tags: tags }, { category: category }, { subcategory: subcategory }, { isPublished: isPublished }] }] },
            { $set: { isDeleted: true } })

        if (blogDetails.modifiedCount == 0 || blogDetails.matchedCount == 0) {
            return res.status(404).send({ status: false, msg: "No blog found" })
        }


        // We don't have to send the updated data as it is a delete api so only sending message --------------------------
        res.status(201).send({ status: true, msg: "Blog deleted Successfully!!" })

    }
    catch (error) {
        res.status(500).send({status:false, msg: error.message })
    }
}


// Exporting all the functions from here -------------------------------------------------------------

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog
module.exports.updateAllBlogs = updateAllBlogs
module.exports.deleteBlog = deleteBlog
module.exports.DeleteByQuery = DeleteByQuery
