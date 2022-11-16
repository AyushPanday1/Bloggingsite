const express = require('express')
const router =  express.Router();

// Path for modules--------------------
const authorController = require('../controller/authorcontroller')
const blogController = require('../controller/blogcontroller')


router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})

// First router for creating author --------------
router.post('/authors', authorController.createAuthor)

router.post('/login',authorController.login)


// Second router for creating blog----------------
router.post('/blogs',blogController.createBlog)


// Third router for getting blogs ---------------
router.get('/getblogs',blogController.getBlog)


//Fourth router for updating blogs --------------
router.put('/update/:blogId',blogController.updateAllBlogs)


// Fifth router for deleting blogs using path params -------
router.delete('/delete/:blogId',blogController.deleteBlog)


// Sixth router for deleting blogs using query params------
router.delete('/deletequery',blogController.DeleteByQuery)

module.exports = router;


