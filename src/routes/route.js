const express = require('express')
const authorController = require('../controller/authorcontroller')
const blogController = require('../controller/blogcontroller')

const router =  express.Router();

router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})

router.post('/authors', authorController.createAuthor)

router.post('/blogs',blogController.createBlog)

router.get('/getblogs',blogController.getBlog)

router.put('/update/:blogId',blogController.updateAllBlogs)

router.delete('/delete/:blogId',blogController.deleteBlog)

router.delete('/deletequery',blogController.DeleteByQuery)

module.exports = router;


