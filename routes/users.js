var express = require('express');
var router = express.Router();
const{mongodb,mongoclient,dbName,dbUrl}=require('../dbconfig')
const{hashCompare,hashPassword,createToken,decodeToken}=require('../bin/auth')

const client = new mongoclient(dbUrl)

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/all',async(req, res, next) => {
  await client.connect();
  try {
    const db = await client.db(dbName);
    let user = await db.collection('users').findOne({email:data.email,username:data.username}); 
    if(user)
    {
        let users = await db.collection('users').find().toArray()
        res.send({
          statusCode: 200,
          users
        })
    }
    else
    {
      res.send({
        statusCode: 401,
        message:'Unauthorized'
      })
    }
  } catch (error) {
    console.log(error)
    res.send({ 
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});
router.get('/:id', async(req, res)=> {
  await client.connect();
  try {
    const db = await client.db(dbName);
    let users = await db.collection('users').findOne({_id: mongodb.ObjectId(req.params.id)});
    res.send({
      statusCode: 200,
      users
    })
  } catch (error) {
    console.log(error)
    res.send({ 
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});
//sign-up
router.post('/register', async(req, res)=> {
  await client.connect();
  try {
    const db = await client.db(dbName);
    let user = await db.collection('users').find({email:req.body.email}).toArray()
    if(user.length===0)
    {
        req.body.password = await hashPassword(req.body.password);
        let users = await db.collection('users').insertOne(req.body);

        res.send({
          statusCode: 200,
          message:"User Added Successfully"
        })
    }
    else
    {
      res.send({
        statusCode: 400,
        message:"User Already Exists, Kindly Login!"
      })
    }
  } catch (error) {
    console.log(error)
    res.send({ 
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});
//login
router.post('/login', async(req, res)=> {
  await client.connect();
  try {
    const db = await client.db(dbName);
    //check if user exists
    let user = await db.collection('users').findOne({username:req.body.username});

    if(user)
    {
    //check if the password matches
    let hashResult = await hashCompare(req.body.password,user.password)
      if(hashResult)
      {
        let token = await createToken({
          username:user.username,
          email:user.email
          
        })
        res.send({
          statusCode: 200,
          message:"User Logged in Successfully",
          token,
          username:user.username
                   
        })
      }
      else
      {
        res.send({
          statusCode: 401,
          message:"Invalid Credentials",
        })
      }
    }
    else
    {
      res.send({
        statusCode: 401,
        message:"User Does Not Exist",
      })
    }
  } catch (error) {
    console.log(error)
    res.send({ 
      statusCode:500,
      message:"Internal Server Error",
      error
    })
  }
  finally{
    client.close()
  }
});





module.exports = router;
