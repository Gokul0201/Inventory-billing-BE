var express = require('express');
var router = express.Router();
const{mongodb,mongoclient,dbName,dbUrl}=require('../dbconfig')
const{hashCompare,hashPassword,createToken,decodeToken}=require('../bin/auth')

const client = new mongoclient(dbUrl)

router.post('/customers',async(req, res, next) => {
    await client.connect();
    try {
    
      const db = await client.db(dbName);
      let users = await db.collection('customers').insertOne(req.body)
      
          res.send({
            statusCode: 200,
            message:"customer added successfully",
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
  
  // to get customer details
  router.get('/customers',async(req, res, next) => {
    await client.connect();
    try {
    
      const db = await client.db(dbName);
      let users = await db.collection('customers').find().toArray()
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
  
  // to get customer details by id
  router.get('/customers/:id', async(req, res)=> {
    await client.connect();
    try {
      const db = await client.db(dbName);
      let users = await db.collection('customers').findOne({_id: mongodb.ObjectId(req.params.id)});
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
  router.put('/edit-customers/:id', async(req, res)=> {
    await client.connect();
    try {
      const db = await client.db(dbName);
      let users = await db.collection('customers').updateOne({_id:mongodb.ObjectId(req.params.id)},{$set:req.body})
      res.send({
        statusCode: 200,
        message:"User Edited Successfully",
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
  
  
  router.delete('/delete-customers/:id', async(req, res)=> {
    await client.connect();
    try {
      const db = await client.db(dbName);
      await db.collection('customers').deleteOne({_id:mongodb.ObjectId(req.params.id)})
      let users = await db.collection('customers').find().toArray();
      res.send({
        statusCode: 200,
        message:"User Deleted Successfully",
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
module.exports = router;