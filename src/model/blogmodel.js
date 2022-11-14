const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const blogmodel = new mongoose.Schema({
     
    title:{
        required:true,
        type:String
    },
    body:{
        required:true,
        type:String
    },
    authorID: {
        required: true,
        type: ObjectId, 
        ref:"Author"
    },
    tags: [ { type: String } ],
    category:{
        type:String,
        required:true
    },
    subcategory:{
        type:[{type:String}],

    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    published_at: Date.now()

},{timestamps:true})

module.exports = mongoose.model("Blog" , blogmodel)