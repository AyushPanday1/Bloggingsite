const express = require('express')
const authorController = require('../controller/authorcontroller')

const router =  express.Router();

router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})
router.post('/BASE_URL/authors', authorController.createAuthor)

module.exports = router;
