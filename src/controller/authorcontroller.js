const Authormodel = require('../model/Authormodel')


const createAuthor = async function(req,res){

try{
const authorInfo = req.body
const data = await Authormodel.create(authorInfo)
res.status(201).send({msg : data})
}

catch(err){
    res.status(500).send({msg : err.message})
}
}

module.exports.createAuthor = createAuthor
