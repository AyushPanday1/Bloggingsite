const mongoose = require('mongoose')

const Authormodel = new mongoose.Schema({
   fname : {
      type: String,
      required : true
   },
   lname : {
      type : String,
      required : true
   },
   title : {
      require : true,
      type : String,
      enum : ["Mr","Mrs","Miss"]
   },
   email : {
      required : true,
      type : String,
      unique : true,
      trim  : true
   },
   password : {
      required : true,
      type : String
   }


},{timestamps : true})


// Exporting the model and declaring database for allowing crud operations in different modules------

module.exports = mongoose.model("Author123" , Authormodel)     