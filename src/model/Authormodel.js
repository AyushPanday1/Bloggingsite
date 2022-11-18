const mongoose = require('mongoose')


// Passing a function to validate email in schema--------------------------

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
       type : String,
       enum : ["Mr" , "Mrs" , "Miss"]
     },

     email : {
       type: String,
       trim: true,
       lowercase: true,
       unique: true,
        required: true,
        validate: [validateEmail, 'Please fill a valid email address'],           // Using the above function in schema-----------
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
     },

     password: {
       required:true,
       type:String
     }},

    {timestamps:true})

// Exporting the model and declaring database for allowing crud operations in different modules------

module.exports = mongoose.model("Author123" , Authormodel)     