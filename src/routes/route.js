const express = require('express')

const router =  express.Router();

router.get('/firstapi' , function(req,res){
    res.send("Yes , it is first api")
})

module.exports = router;
