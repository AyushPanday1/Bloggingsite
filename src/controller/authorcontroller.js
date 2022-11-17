const Authormodel = require('../model/Authormodel')        // Importing Authormodel for using in this controller module.
const jwt = require('jsonwebtoken')

//1st-- Author API-------------------------------------------------------------------------------------------
const createAuthor = async function (req, res) {

    try {
        const authorInfo = req.body
        const data = await Authormodel.create(authorInfo)
        res.status(201).send({ msg: data })
    }

    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}

const login = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    try {
        let author = await Authormodel.findOne({ email: email, password: password });
        if (!author)
            return res.status(400).send({
                status: false,
                msg: "username or the password is not corerct",
            });


        let token = jwt.sign(
            {
                authorID: author._id.toString(),
                email,
                batch: "Lithium",
                project: "project1",
            },
            "functionup-secret-key"
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, msg: "Successful-login-Response-structure", data: token });
    } catch (Err) {
        return res.status(400).send({ status: false, msg: "username or password is not correct" });
    }
};

module.exports.createAuthor = createAuthor 
module.exports.login = login                // Exporting module for using in router.
