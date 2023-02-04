const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();
const requireLogin=require("../middleware/requireLogin")
const User=mongoose.model("User")
const Post=mongoose.model("Post")


router.get("/user/:id",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else{
                res.json({user,posts})
            }
        })
    })
    .catch((e)=>{
        return res.status(404).json({error:"User not found"})
    })
})


router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
          return  res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{
            new:true
        })
        .select("-password")
        .then((result)=>{
            res.json(result)
        })
        .catch((e)=>{
            return res.status(422).json({error:e})
        })
    })

})


router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
          return  res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{
            new:true
        })
        .select("-password")
        .then((result)=>{
            res.json(result)
        })
        .catch((e)=>{
            return res.status(422).json({error:e})
        })
    })

})


router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{photo:req.body.photo}
    },{new:true},(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json(result)
    })
})


router.delete("/deleteaccount",requireLogin,(req,res)=>{
    User.findOne({_id:req.user._id})
    .select("-password")
    .exec((err,user)=>{
        if(err || !user){
          return  res.status(422).json({error:err})
        }

        user.remove()
        .then((result)=>{
            Post.deleteMany({postedBy:req.user._id})
            .exec((err,post)=>{
                if(err){
                console.log(err)    
                }
                else{
                    res.json({result,post})
                }
            })

           
           
        })
        
    })
})


router.post("/searchuser",requireLogin,(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query,"i")
    User.find({name:{$regex:userPattern}})
    .select("_id email name photo")
    .then((user)=>{
        res.json({user})
    })
    .catch((e)=>{
        console.log(e)
    })
}
)


module.exports=router