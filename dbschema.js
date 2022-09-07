const mongoose = require('mongoose');
const validator = require('validator');

var userSchema = new mongoose.Schema({
    name:{type:'string',required:true},
    email:{
        type:'string',
        required:true,
        lowercase:true,
        validate:(value)=>{
            return validator.isEmail(value)
        }
    },
    createdAt:{type:Date,default:Date.now}
})

const UserDetails=mongoose.model('users',userSchema);