const blogModel = require('../model/blogmodel.js')


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


module.exports.getBlog = getBlog