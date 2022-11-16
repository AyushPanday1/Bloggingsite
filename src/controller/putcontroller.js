const { default: mongoose } = require('mongoose');
const blogModel = require('../model/blogmodel.js')

const ObjectId = mongoose.Schema.Types.ObjectId;

const updateblog = async function(req,res){
    try{
    let blogid = (req.params.blogID);
    console.log(blogid)
    
    let data = await blogModel.find({isDeleted:false,_id:blogid});
    if(!data){
        return res.status(404).send("No blog exists")
    }
    
    const {title,body,tags,subcategory}  = req.body;

    if(!tags && !subcategory){
        return res.send({status:false , msg:"Tags and subcategory is important and need to be added"})
    }
    
    let savedata = await blogModel.updateOne({isDeleted:false,_id:blogid},{ $set: {title:title , body:body , tags:tags,subcategory:subcategory, isPublished:true} },{ new: true });
    return res.status(200).send(savedata);
    
    } catch(err){
        res.status(500).send(err.message)
    }
}

module.exports.updateblog=updateblog