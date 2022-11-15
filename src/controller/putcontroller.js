const blogmodel = require('../model/blogmodel')
const mongoose = require('mongoose');
const{isValidObjectId} = require("mongoose")




const updateAllBlogs = async function (req, res) {
try{
    const blogId1 = req.params.blogId
    if(!isValidObjectId(blogId1)){
    return res.send("BlogId is not valid")
    }
    let available = await blogmodel.findById(blogId1)
    if(!available){
    return res.status(400).send({status: false, msg: "BlogId not found"})
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
            subcategory: subcategryData

        }
    }, { new: true })
    return res.status(200).send({ msg: blogData })
 }
catch(error){
    res.status(400).send({msg:error})
    console.log({msg: error})
}};

module.exports.updateAllBlogs = updateAllBlogs