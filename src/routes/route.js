const express = require('express')
const router =  express.Router();

// Path for modules--------------------
const authorController = require('../controller/authorcontroller')
const blogController = require('../controller/blogcontroller')
const midAuth = require('../Middleware/commonMiddleware')


router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})

// First router for creating author --------------
router.post('/authors', authorController.createAuthor)


//Api for log in -------------------------------------
router.post('/login',authorController.login)


// Second router for creating blog----------------
// router.post('/blogs',    midAuth.authentication,      blogController.createBlog)
router.post('/blogs',  blogController.createBlog)

// Third router for getting blogs ---------------
// router.get('/getblogs',     midAuth.authentication,    blogController.getBlog)
router.get('/blogs',midAuth.authentication, blogController.getBlog)

//Fourth router for updating blogs --------------
// router.put('/blogs/:blogId',   midAuth.authentication,    midAuth.authorizationbypath,   blogController.updateAllBlogs)
router.put('/blogs/:blogId' , midAuth.authentication, blogController.updateAllBlogs)


// Fifth router for deleting blogs using path params -------
// router.delete('/delete/:blogId',  midAuth.authentication,     midAuth.authorizationbypath,     blogController.deleteBlog)
router.delete('/delete/:blogId', midAuth.authentication, blogController.deleteBlog)

// Sixth router for deleting blogs using query params------
// router.delete('/deletequery',   midAuth.authentication,      blogController.DeleteByQuery)   // midAuth.authorisebyquery, 
router.delete('/delete', midAuth.authentication, blogController.DeleteByQuery)

module.exports = router;


