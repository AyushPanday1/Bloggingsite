const Authormodel = require('../model/Authormodel')             // Importing Authormodel from authormodel.js module
const blogModel = require('../model/blogmodel')                 // Importing blogmodel   from  blogmodel.js  module

const mongoose = require('mongoose')
const { isValidObjectId } = require("mongoose");                // Inbuilt function of mongoose to check any id is valid object id or not


//2nd- post API------------------------------------------------------------------------------------------------

// const createBlog = async function (req, res) {

//     try {
//         let authorId = req.body.authorId
//         let blog = req.body
//         if (!authorId) {
//             return res.status(400).send({ status: false, msg: "AuthorId must be present" })
//         }

//         // Checking author id is valid or not ---------------------------------------------------------------
//         if (!isValidObjectId(authorId)) {
//             return res.send("authorid is not valid")
//         }

//         let available = await Authormodel.findById(authorId)
//         if (!available) {
//             return res.status(400).send({ status: false, msg: "Authorid not found" })
//         }
//         let savedBlog = await blogModel.create(blog)
//         res.status(201).send({ status: true, msg: savedBlog })
//     }
//     catch (error) {
//         res.status(500).send({ status:false,msg: error })
//         console.log({ msg: error })
//     }
// };

        let createBlog = async function( req, res){
            try{
            let data = req.body
            let{title,body,authorId,tags,subcategory} = data
            if(Object.keys(data).length ==0){
                return res.status(400).send({status: false , msg : "please provide all the required data"})
            }
            if(!title || title == ""){
                return res.status(400).send({status: false , msg : "please enter title"})
            }
            
            if(!body || body == ""){
                return res.status(400).send({status : false , msg : "please enter body"})
            }
            
            if(!authorId || authorId == ""){
                return res.status(400).send({status : false , msg : "please enter authorId"})
            }
            
            if(!isValidObjectId(authorId)){
                return res.status(400).send({status: false, msg : "invalid authorId"})
            }
            let authorDetail = await Authormodel.findById(authorId)
            if(!authorDetail){
                return res.status(400).send({status : false, msg : "authorId is not present"})
            }
            if(!tags|| tags == ""){
                return res.status(400).send({status: false, msg : "please enter tags"})
            }
            if(!subcategory || subcategory == 0){
                return res.status(400).send({status : false , msg : "subcategory is required"})
            }
            if(data.isPublished=== true)
            data.publishedAt = Date.now()
                
            let savedData = await blogModel.create(data)
            return res.status(200).send({status : true, msg : "blog successfully created ",data})
        }
        catch(error){
            return res.status(500).send({status : false , msg : error.message})
        }
        }



//3rd- get blog API---------------------------------------------------------------------------------------

// const getBlog = async function (req, res) {
//     try {

//         // Taking all queries in one object to reduce time  --------------------------------------------
//         const { authorId, category, tags, subcategory } = req.query

//         let data = {

//             isDeleted: false,
//             isPublished: true,

//         }
//         if (authorId) {
//             data.authorId = authorId    //making a key named authorID and store the authorID
//         }
//         if (category) {
//             data.category = category
//         }

//         if (tags) {
//             data.tags = tags         //data.tags(keys)=tags(destructure)
//         }
//         if (subcategory) {
//             data.subcategory = subcategory
//         }

//         const result = await blogModel.find(data)


//         if (result.length>0) {        //if the element is greater than 0 than it will return "no data found"
//             res.status(201).send({ status:true,msg: result })
//         }
//         else {
//             res.status(404).send({status:false, msg: "No data found" })
//         }
//     }
//     catch (error) {
//         res.status(500).send({status: false, msg: error.message })
//     }
// }


    const getBlog = async function(req,res){
        try{
        const filteredBlog = await blogModel.find({isDeleted : false, isPublished : true})
        if(filteredBlog.length==0 || !filteredBlog){
              return res.status(404).send({status : false, msg : "no data found"})
        }
        else if(filteredBlog){
            let queryParams = req.query
        
        if(Object.keys(queryParams).length ==0){
            return res.status(400).send({status : false , msg : "no query data found"})
        }
        const data = await blogModel.find(queryParams)
        if(!data || data.length ==0){
            return res.status(400).send({status : false , msg : "quer data not found"})
        }
        return res.status(200).send({status : true, msg : "some data found ",filteredBlog})
    }
    }
    catch(error){
        return res.status(500).send({status : false, msg : error.message})
    }
}



//4th - PUT /blogs/:blogId--------------------------------------------------------------------------------


// const updateAllBlogs = async function (req, res) {
//     try {
//         let {authorId,category,isDeleted} = req.body   
//         if((authorId||category||isDeleted)){                     //edge case if any of these entered in the body then it will through an error 
//             res.status(400).send({status : false, msg : "Don't want these attributes"})
//         }

//         const blogId1 = req.params.blogId
//         if (!isValidObjectId(blogId1)) {
//             return res.send({status : false, msg:"BlogId is not valid"})
//         }

//         // Available is checking that the wanted data is available in our database or not--------------
//         let available = await blogModel.findById(blogId1)

//         if (!available) {
//             return res.status(400).send({ status: false, msg: "BlogId not found" })
//         }

//         // Taking all attributes in one object to reduce time -----------------------------------------

//         const { title, body, tags, subcategory } = req.body

//         const findBlog = await blogModel.find({_id:blogId1,isDeleted:false})

//         const tagsData = findBlog.tags
//         const subcategryData = findBlog.subcategory

//         // Adding New tags and subcategories in previous existing data(arrays)-----------------------
//         tagsData.push(tags)
//         subcategryData.push(subcategory)


//         const blogData = await blogModel.findByIdAndUpdate(blogId1, {
//             $set: {
//                 title: title,
//                 body: body,
//                 tags: tagsData,
//                 subcategory: subcategryData,
//                 isPublished: true

//             }
//         }, { new: true })
//         return res.status(200).send({ status:true,msg: blogData })
//     }
//     catch (error) {
//         res.status(500).send({ status: false,msg: error.message })
//         console.log({ msg: error.message })
//     }
// };


    const updateAllBlogs = async function(req,res){
        try{
        let data = req.body
        let blogId = req.params.blogId

        if(Object.keys(data).length ==0){
            return res.status(400).send({status : false , msg : "request body can't not be blank"})
        }
        if(!isValidObjectId(blogId)){
            return res.status(400).send({status : false , msg : "invalid blogId"})
        }
        if(!blogId){
            return res.status(400).send({status : false , msg : "blogId is required "})
        }
        let blogDetails = await blogModel.findById(blogId)
        if(!blogDetails){
            return res.status(400).send({status : false , msg : "blogId is invalid"})
        }
        if(blogDetails._id != blogId){
            return res.status(400).send({status : false , msg : "blogDetails not found"})
        }
        if(blogDetails.isDeleted == true){
            return res.status(400).send({status : false , msg : "blog is already deleted"})
        }
        if(blogDetails.isDeleted == false){
            let updateBlogs = await blogModel.findByIdAndUpdate({_id : blogId},{
                $set :{
                    title : data.title,
                    body : data.body,
                    isPublished : true,
                    publishedAt : Date.now()
                },
                $push: {
                    tags : data.tags,
                    subcategory : data.subcategory
                },
            },{new : true, upsert : true})  
                return res.status(200).send({status : true , msg : "blog updated successfully",updateBlogs})

          
        }
    }
    catch(error){
         return res.status(500).send({status : false , msg : error.message})
    }

    }




// 5th- DELETE /blogs/:blogId--------------------------------------------------------------------------------

// const deleteBlog = async function (req, res) {
//     try {
//         const blogId = req.params.blogId


//         if (!isValidObjectId(blogId)) {
//             res.status(400).send({ msg: "invalid blogId" })
//         }

//         let blog = await blogModel.find({ isDeleted: false, _id: blogId })

//         if (!blog) {
//             return res.status(400).send({ status: false, msg: "Blog not found" })
//         }


//         // beFore updating we pass the conditions that data should not be deleted and returning the updated data using new:true.
//         let deletddata = await blogModel.findOneAndUpdate({ isDeleted: false, _id: blogId }, { isDeleted: true, deletedAt : new Date(Date.now()) }, { new: true })

//         res.status(201).send({ status : true , Refrence:deletddata , Message: "Deleted successfully!!"})
//     }
//     catch (err) {
//         res.status(500).send({status: false, msg: err.message })
//     }
// }

      const deleteBlog = async function(req,res){
        try{
        let blogId = req.params.blogId
        if(!isValidObjectId(blogId)){
            return res.status(400).send({status : false , msg : "blogId is not valid"})
        }
        let data = await blogModel.findById(blogId)
        if(!data){
            return res.status(400).send({status : false , msg : "blogId is required(id doesn't exist)"})
        }
        if(data){
            if(data.isDeleted == false){
                await blogModel.findOneAndUpdate({_id : blogId},{isDeleted : true, deletedAt : Date.now()},{new : true})
                return res.status(200).send({status : true, msg : "blog deleted successfully"})
            }else{
                return res.status(200).send({status : true, msg : "blog already deleted"})
            }

        }
    }
    catch(error){
          return res.status(500).send({status : false , msg : error.message})
    }
      }




// 6th -DELETE /blogs?queryParams---------------------------------------------------------------------------

// const DeleteByQuery = async function (req, res) {
//     try {

//         let data = req.query


//         let { authorId, tags, category, subcategory, isPublished , decodedToken } = data


//         if (!(authorId || tags || category || subcategory || isPublished || decodedToken )) {
//             return res.status(400).send({ status: false, msg: "Please pass any query" })
//         }
//         // As in the above data only author id is object id so validating it-----------------------------
//         if (!isValidObjectId(authorId)) return res.status(400).send({ msg: "Authorid is invalid" })

//         // $or means if any of the condition matches --------------------------------------------------
//         let blog = await blogModel.find(req.query)

//         if (blog.length==0) return res.status(404).send({ status: false, msg: "False" })


//         //Before updating firstly we are checking it if data is deleted or not so only passing not deleted data--------------
//         let blogDetails = await blogModel.updateMany({ $and: [{ isDeleted: false, authorId : req.decodedToken },data ] },{ $set: { isDeleted: true , deletedAt : new data(), isPublished : false }},{new : true})
            

//         if (blogDetails.modifiedCount == 0 || blogDetails.matchedCount == 0) {
//             return res.status(404).send({ status: false, msg: "No blog found" })
//         }


//         // We don't have to send the updated data as it is a delete api so only sending message --------------------------
//         res.status(201).send({ status: true, msg: "Blog deleted Successfully!!" })

//     }
//     catch (error) {
//         res.status(500).send({status:false, msg: error.message })
//     }
// }


const DeleteByQuery = async function (req, res) {
    try {
        const queryData = req.query

        // checking data is coming from query 
        if (Object.keys(queryData).length == 0) {
            return res.status(400).send({ status: false, msg: "enter some data in query" })
        }

        const alldata = await blogModel.find({ $and: [queryData, { isDeleted: false }, { isPublished: true }] })

        if (alldata.isDeleted == true  ) {  
            return res.status(404).send({ status: false, msg: "Blog is already deleted" })
        }
        if(alldata.length == 0){
            return res.status(400).send({status : false , msg : "length is 0"})
        }

        if (!alldata) {
            return res.status(400).send({ status: false, msg: "no data with this query" })
        } else {
            const deleteData = await blogModel.updateMany(queryData, { $set: { isDeleted: true, deletedAt: new Date(), isPublished: false } }, { new: true })

            return res.status(200).send({ status: true, msg: "data succesfully deleted" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// Exporting all the functions from here -------------------------------------------------------------

module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog
module.exports.updateAllBlogs = updateAllBlogs
module.exports.deleteBlog = deleteBlog
module.exports.DeleteByQuery = DeleteByQuery
