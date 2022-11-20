const Authormodel = require('../model/Authormodel')        // Importing Authormodel for using in this controller module.
const jwt = require('jsonwebtoken')
let nameRegex = /^[a-zA-Z]{1,20}$/
let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

//1st-- Author API-------------------------------------------------------------------------------------------
// const createAuthor = async function (req, res) {

//     try {
//         const authorInfo = req.body
//         const data = await Authormodel.create(authorInfo)
//         res.status(201).send({ status:true ,msg: data })
//     }

//     catch (err) {
//         res.status(500).send({ msg: err.message })
//     }
// }
     const createAuthor = async function(req,res){
        try{
        let data = req.body
        let {fname, lname, email, title, password} = data
        if(Object.keys(data).length ==0){
            return res.status(400).send({status : false, msg : "all keys are required"})
        }
       if(!fname || fname == ""){
             return res.status().send({status : false , msg : " fname is mandatory"})
       }
       
       if(!nameRegex.test(fname)){
        return res.status(400).send({status: false , msg : "enter a valid fname"})
       }
       if(!lname || lname == ""){
           return res.status(400).send({status : false, msg : " lname is mandatory"})
       }
       if(!nameRegex.test(lname)){
        return res.status(400).send({status: false , msg : "enter a valid lname"})
       }
       if(!email || email == ""){
        return res.status(400).send({status : false , msg : "email is mandatory"})
       }
       if(!emailRegex.test(email)){
        return res.status(400).send({status: false, msg : "please enter valid email"})
       }
       if(!title || title == ""){
        return res.status(400).send({ status : false , msg : "title is mandatory"})
       }
       if(!password || password == ""){
        return res.status(400).send({status : false , msg : "password is mandatory"})
       }
       if(!passwordRegex.test(password)){
           return res.status(400).send({status: false, msg : "please enter a valid password"})
       }
       else {
        let user = await Authormodel.create(data)
        return res.status(200).send({status : true, msg: "author created successfully",data})
       }
    }
    catch(error){
        return res.status(500).send({status : false , msg : error.message})
    }
     }
    
    






// Api for login of user and creating a json web token (jwt)------------------------------------------------
const login = async function (req, res) {
    try {
    let email = req.body.email;
    let password = req.body.password;
    if(!email || email === ""){
        return res.status(400).send({status : false , msg : "you have to provide email for login"})
    }else
     email= email.trim()
    if(!password || password === ""){
        return res.status(400).send({status : false , msg : "you have to provide password for login"})
    }else
    password = password.trim()
    
        let author = await Authormodel.findOne({ email: email, password: password });
        if (!author)
            return res.status(400).send({
                status: false,
                msg: "username or the password is not correct",
            });


        let token = jwt.sign(
            {
                authorId: author._id.toString(),
                batch: "Lithium",
                project: "project1",
            },
            "functionup-secret-key"
        );

        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, msg: "Successfully-logged-in", data: token });

    } catch (Err) {
        return res.status(500).send({ status: false, msg: Err.message });
    }
};


// Exporting modules for using in router.
module.exports.createAuthor = createAuthor 
module.exports.login = login                
