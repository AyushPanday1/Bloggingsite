const mongoose = require('mongoose')

var validateEmail = function(email) {
   var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   return re.test(email)
};

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
       type: String,
       trim: true,
       lowercase: true,
       unique: true,
       required: true,
       validate: [validateEmail, 'Please fill a valid email address'],
       match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
     },

     password: {
        required:true,
       type:String
     }}, {timestamps:true})

module.exports = mongoose.model("Author" , Authormodel)