const jwt = require('jsonwebtoken');

// Validating and authenticating the id ------------------------------------------------------------------

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        console.log(token)
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "functionup-secret-key")
        console.log(decodedToken)

        next()
    }
    catch (error) {
        return res.status(400).send({ status: false, key: error.message });
    }
}



// Authorisation for checking user if is authorised to do the task or not-----------------------------------
const authorizationbypath = async (req, res, next) => {
    try {
        const blogId = req.params.blogId;

        if (!isValidObjectId(blogId))
            return res.status(400).send({ status: false, msg: "BlogId is not valid" })
        
        const token = req.headers["x-api-key"];

        const decodedToken = jwt.verify(token,"functionup-secret-key");

        if (!decodedToken)
            return res.status(400).send({ status: false, msg: "Provide your own token" });
        
        const blog = await blogModel.findById(blogId)

        if (blog.authorId.toString()  != decodedToken.authorId)
            return res.status(400).send({ status: false, msg: "Unauthorized person" });

        next()
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

// Authorisation with the data of query section ------------------------------------------

const authorisebyquery = async function (req, res, next) {
   
    try {

                                                                          
        let Loggedinuser =  req["x-api-key"].authorID                           // Taking the user id of decodedtoken from server------------     
         
        let {category, authorID, tags, subcategory, isPublished} = req.query;  // Taking attributes in query section -----------------------
       
        const object =                                                           // Making an object with not deleted data -------------------
        {
            isDeleted: false
        };

        if(category)                                                           // IF user is giving category then add it to object and so on-
        object.category = category;

        if(authorID) 
        object.authorID = authorID;

        if(tags)
        object.tags = tags;

        if(subcategory)
        object.subcategory = subcategory;

        if(isPublished == false) 
        object.isPublished = isPublished;

        // Here i am checking from databse with object queries and applying extra filter to be same author id of loggedinuser

        let matchedData = await blogModel.find(object).filter(x => x.authorID == Loggedinuser); 

        if(!matchedData)
        return res.status(404).send({status: false, msg: "No such data found."});

        // Checking if both ids are same or not----------------------------------------------------------------
        if ((matchedData != Loggedinuser)) {
            return res.status(403).send({ msg: "User Has No Access" })
        }

        req.object = object;

        next()
    }
    catch (error) {
        return res.status(500).send({status:false,msg: error.message})
    }
}


// Exporting files --------------------------------------------------------

module.exports.authentication = authentication ;
module.exports.authorizationbypath = authorizationbypath ;
module.exports.authorisebyquery = authorisebyquery;


    
