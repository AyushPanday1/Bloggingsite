const express = require('express')
const authorController = require('../controller/authorcontroller')
const postcontroller   = require('../controller/postcontroller.js')
const getcontroller = require('../controller/getcontroller')
const updateAllBlogs = require('../controller/putcontroller')

const router =  express.Router();

router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})

router.post('/authors', authorController.createAuthor)

router.post('/blogs',postcontroller.createBlog)

router.get('/getblogs',getcontroller.getBlog)

router.put('/update/:blogId',updateAllBlogs.updateAllBlogs)


module.exports = router;


