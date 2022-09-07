var express = require('express');
var router = express.Router();
const{mongodb,mongoclient,dbName,dbUrl}=require('../dbconfig')


const client = new mongoclient(dbUrl)

router.post('/stocks',async(req, res, next) => {
    await client.connect();
    try {
    
      const db = await client.db(dbName);
      let users = await db.collection('stocks').insertOne(req.body)
      
          res.send({
            statusCode: 200,
            message:"stock were added successfully",
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
  router.get('/stocks',async(req, res, next) => {
    await client.connect();
    try {
    
      const db = await client.db(dbName);
      let users = await db.collection('stocks').find().toArray()
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
  
  // to get Stocks by id
  router.get('/stocks/:id', async(req, res)=> {
    await client.connect();
    try {
      const db = await client.db(dbName);
      let users = await db.collection('stocks').findOne({_id: mongodb.ObjectId(req.params.id)});
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

  router.delete('/delete-stocks/:id', async(req, res)=> {
    await client.connect();
    try {
      const db = await client.db(dbName);
      await db.collection('stocks').deleteOne({_id:mongodb.ObjectId(req.params.id)})
      let users = await db.collection('stocks').find().toArray();
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