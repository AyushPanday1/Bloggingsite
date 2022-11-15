const blogModel = require('../model/blogmodel.js')


const getBlog = async function (req, res) {
 try {
    const { authorID, category, tags, subcategory } = req.query
        let obj1 = {
            isDeleted: false,
            isPublished: true,
        }
        if (authorID) {
            obj1.authorID = authorID
        }
        if (category) {
            obj1.category = category
        }

        if (tags) {
            obj1.tags = tags
        }
        if (subcategory) {
            obj1.subcategory = subcategory
        }


        const result = await blogModel.find(obj1)

        if (result) {
            res.status(201).send({ msg: result })
        }
        else {
            res.status(404).send({ msg: "Nothing Found" })
        }

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports.getBlog = getBlog