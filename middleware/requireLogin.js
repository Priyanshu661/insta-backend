const jwt=require("jsonwebtoken")
const { default: mongoose } = require("mongoose")
const {JWT_SECRET}=require("../config/keys")
const User=mongoose.model("User")


module.exports=(req,res,next)=>{
    const {authorization}=req.headers

    if(!authorization){
       return res.status(401).send({error:"Unauthorized"})
    }

   const token = authorization.replace("Bearer ","")

   jwt.verify(token,JWT_SECRET,(err,payload)=>{
    if(err){
      return  res.status(401).json({error:"you must be logged in"})
    }
      
    const {_id}=payload;
    User.findById(_id).then(userData=>{
        req.user=userData
        next()
    })
      
   })
}