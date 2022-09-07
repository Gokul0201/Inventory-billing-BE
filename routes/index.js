var express = require('express');
var router = express.Router();
var moongoose=require('mongoose');
var {UserDetails} = require('../dbschema')
const{mongodb,mongoclient,dbName,dbUrl}=require('../dbconfig')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send("Server is Running Successfully");
});

router.get('/all',async(req, res, next) =>{
  try {
    let users= await UserDetails.find();
    res.send({ 
      statusCode:200,
      users:users
    })
  } catch (error) {
    console.log(error)
    res.send({
      statusCode:500,
      message:"Internal server error",
      error
    })
    
  }

});

router.post('/add-user',async(req,res)=>{
  try {
    let users = await UserDetails.create(req.body);
    res.send({statusCode:200,message:"User added successfully"})
  } catch (error) {
    console.log(error)
    res.send({statusCode:500,message:"Internal Server Error",error})
  }
})


module.exports = router;
