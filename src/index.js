const express = require('express');

const mongoose = require('mongoose');

const route = require('./routes/route')

const app = express();

app.use('/' , route);

mongoose.connect("" ,{
    useNewUrlparser :true
})
.then(()=>console.log("Mongodb is Connected"))
.catch((err)=>console.log(err.message))



app.listen(3000 , function(){
    console.log("Running on the port " ,3000)
})