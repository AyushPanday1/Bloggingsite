const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;         // Declaring this as object id contains characters as well as digits too-----

const blogmodel = new mongoose.Schema({
     
    title:{
        required:true,                                 
        type:String
    },
    body:{
        required:true,
        type:String
    },
    authorID : {
        required: true,
        type: ObjectId, 
        ref:"Author123"                                // Refrence to author model database-----------
    },

    tags: [ { type: String } ],

    category:{
        type:String,
        required:true
    },

    subcategory:[{type:String}],                      // Array of strings--------------------------

    isDeleted:{
        type:Boolean,
        default:false
    },
    published_at: Date,
    
    isPublished:{
        type:Boolean,
        default:false
    }

   

},{timestamps:true})

module.exports = mongoose.model("Blog" , blogmodel)      // Exporting the model for allowing crud operations in different modules------