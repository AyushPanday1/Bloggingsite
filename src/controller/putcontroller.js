const blogmodel = require('../model/blogmodel')
const mongoose = require('mongoose');




const updateAllBlogs = async function (req, res) {
    const blogId1 = req.params.blogId
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

module.exports.updateAllBlogs = updateAllBlogs