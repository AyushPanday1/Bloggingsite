const jwt = require('jsonwebtoken');
const {isValidObjectId} = require('mongoose')
const blogModel = require('../model/blogmodel')

// Validating and authenticating the id -----------------------------------------------------------------

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

         jwt.verify(token, "functionup-secret-key",function(err,decodedToken){
            if(err){
                return res.status(400).send({status : false, msg : "token invalid"})
            }else{
                req.token = decodedToken
                 next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, key: error.message });
    }
}

//---------------------------------------------AUTHORIZE AUTHOR--------------------------------------------------//

const authoriseAuhtor = async function (req, res, next) {
    try {
        const blogId = req.params.blogId
        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: false, msg: "invalid blogId" })
        }
        const blogData = await blogModel.findById(blogId)
        if (!blogData) {
            return res.status(400).send({ status: false, msg: "Provide valid blogId" })
        }
        let authorId = blogData.authorId      
        let authorIdFromDT = req.token.authorId
        if (authorId != authorIdFromDT) {
            return res.status(403).send({ status: false, msg: "access denied" })
        }
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

//---------------------------------------------authenticating author from query--------------------------------------------------//

const authoriseAuthorfrmQuery = async function (req, res, next) {
    try {
        const queryData = req.query
        const queryDoc = await blogModel.find(queryData)
        if (queryDoc.length == 0) {
            return res.status(404).send({ status: false, msg: "data not found!" })
        }
        for (let i = 0; i < queryDoc.length; i++) {
            let elem = queryDoc[i]
            let authorId = elem.authorId.toString()
            if (authorId !== req.token.authorId) {
                return res.status(403).send({ status: false, msg: "access denied!!" })
            } else {
                next()
            }
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}




// Exporting files --------------------------------------------------------

module.exports.authentication = authentication ;
module.exports.authoriseAuthorfrmQuery = authoriseAuthorfrmQuery ;
module.exports.authoriseAuhtor = authoriseAuhtor



    
