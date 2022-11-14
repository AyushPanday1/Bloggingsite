const mongoose = require('mongoose')

const Authormodel = new mongoose.Schema({
  
     fname : {
        type : String,
        required : true
     },

     lname: {
        type:String,
        requird:true
     },

     title: {
       required : true,
       enum : ["Mr" , "Mrs" , "Miss"]
     },

     email : {
        required :true,
        unique:true,
     },

     password: {
        required:true,
       type:String
     }}, {timestamps:true})

module.exports = mongoose.model("Author" , Authormodel)