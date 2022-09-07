const mongodb = require('mongodb');
require('dotenv').config()
const mongoclient = mongodb.MongoClient;
const dbName=process.env.DB_NAME;
const dbUrl=`mongodb+srv://gokul:admin123@gokul.uxbkh.mongodb.net/${process.env.DB_NAME}`;






module.exports={mongodb,mongoclient,dbName,dbUrl}