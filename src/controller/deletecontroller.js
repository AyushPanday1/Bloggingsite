// const blogModel = require('../model/blogmodel.js')

// const deleteblog = async function(req,res){
//    try{ let blogid = req.params.blogID;

//     let data = await blogModel.find({isDeleted:false,_id:blogid});
//     if(!data){
//         return res.status(404).send("No blog exists")
//     }

//     let saveddata = await data.find({isDeleted:false,_id:blogid})
//     return res.status(200).send(data);
// } catch(err){
// console.log(err)
// } }

// module.exports.deleteblog = deleteblog;