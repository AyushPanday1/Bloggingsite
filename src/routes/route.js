const express = require('express')
const authorController = require('../controller/authorcontroller')
const postcontroller   = require('../controller/postcontroller.js')


const router =  express.Router();

router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})
router.post('/BASE_URL/authors', authorController.createAuthor)

router.post('/blogs',postcontroller.createBlog)



module.exports = router;
