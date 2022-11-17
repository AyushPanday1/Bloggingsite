const jwt = require('jsonwebtoken');


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




const Authorisation = function (req, res, next) {



    
}



module.exports.authentication = authentication
module.exports.Authorisation = Authorisation


    
