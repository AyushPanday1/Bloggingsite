// Entry file--------------------------------
const express = require('express');

const mongoose = require('mongoose');

const route = require('./routes/route')

const app = express();

const jwt = require('jsonwebtoken')

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/' , route);

mongoose.connect("mongodb+srv://AyushPanday:AyushPan123@cluster0.eixapeq.mongodb.net/?retryWrites=true&w=majority" ,{
    useNewUrlparser :true
})
.then(()=>console.log("Mongodb is Connected"))
.catch((err)=>console.log(err.message))



app.listen(3000 , function(){
    console.log("Running on the port",3000)
})