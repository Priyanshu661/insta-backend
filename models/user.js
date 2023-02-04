const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }],
    photo:{
        type:String,
        default:"https://res.cloudinary.com/dxmmbsgdl/image/upload/v1675234562/no_pic_vbgtjp.jpg"
        
    }
})

mongoose.model("User",userSchema)