const jwt = require("jsonwebtoken")
const {jwt_secret } = require("../../keys.js")
const mongoose = require("mongoose")
const User = require("../models/user")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if(!authorization){
        return  res.status(401).json({error : "You must have logged In erro due to !authorization"})
    }
    const token = authorization.replace("Bearer ","")

    jwt.verify(token,jwt_secret,(err,payload)=>{ //payload is simply data encoded in token
        if(err){
            return  res.status(401).json({error : "You must have logged In 1 "})

        }
        const {_id}=payload
        User.findById(_id)
        .then(userData =>{
            req.user = userData
            next();
            console.log(userData)
        })
    })
}