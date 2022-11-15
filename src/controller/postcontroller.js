const blogModel = require('../model/blogmodel.js')
const Authormodel = require('../model/Authormodel')
const mongoose  = require('mongoose');
const{isValidObjectId} = require("mongoose")


const createBlog = async function(req,res){

try{
 let authorID = req.body.authorID
 let blog = req.body
  if(!authorID){
    return res.status(400).send ({status: false, msg: "AuthorId must be present"})
  }
  if(!isValidObjectId(authorID)){
    return res.send("authorid is not valid")
}

let available = await Authormodel.findById(authorID)
 if(!available){
    return res.status(400).send({status: false, msg: "Authorid not found"})
 }
  let savedBlog = await blogModel.create(blog)
  res.status(201).send({status: true, msg: savedBlog}) 
}
catch(error){
    res.status(400).send({msg:error})
    console.log({msg: error})
}};

module.exports.createBlog=createBlog;