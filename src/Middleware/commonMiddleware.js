const jwt = require('jsonwebtoken');
const {isValidObjectId} = require('mongoose')
const blogModel = require('../model/blogmodel')

// Validating and authenticating the id -----------------------------------------------------------------

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        // console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "functionup-secret-key",function(err,decoded){
            if(err){
                return res.status(400).send({status : false, msg : "token invalid"})
            }else{
                req.authorId = decoded.authorId
                return next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, key: error.message });
    }
}



// Authorisation for checking user if is authorised to do the task or not-----------------------------------
const authorizationbypath = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"];
        const decodedToken = jwt.verify(token,"functionup-secret-key");

        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "Provide your own token" });
      
            const blogId = req.params.blogId;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ status: false, msg: "BlogId is not valid" })
         
        
        const blog = await blogModel.findById(blogId)
        if(!blog){
            res.status(400).send({status: false, msg: "blogId is invalid"})
        }

        if (blog.authorId  != decodedToken.authorId){
            return res.status(400).send({ status: false, msg: "Unauthorized person" });
        }

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}



// Exporting files --------------------------------------------------------

module.exports.authentication = authentication ;
module.exports.authorizationbypath = authorizationbypath ;



    
