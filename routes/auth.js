const express=require("express");
const { default: mongoose } = require("mongoose");
const router=express.Router();
const User=mongoose.model("User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_SECRET}=require("../config/keys")
const requireLogin=require("../middleware/requireLogin")


router.post("/signup", (req, res) => {
    const { name, email, password,pic } = req.body;

    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "User already exists with that email" })
            }

            bcrypt.hash(password, 12)
                .then((hashedPassword) => {
                    const user = new User({
                        name,
                        email,
                        password: hashedPassword,
                        photo:pic
                    })

                    user.save()
                        .then((user) => {
                            res.json({ message: "signup successfully" })

                        })
                        
                        .catch((err) => {
                            console.log(err)
                        })
                })
        })


        .catch((err) => {
            console.log(err)
        })



})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body;

    if( !email || !password){
       return res.status(422).json({error:"Please add email or password"})
    }

    User.findOne({email:email})
    .then((savedUser)=>{
       if(!savedUser){
        return res.status(422).json({error:"Invalid email or password"})
       }

        bcrypt.compare(password,savedUser.password)
        .then((doMatach)=>{
            if(doMatach){
                // res.json({message:"Successfully signed in"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,photo}=savedUser
                res.json({token,user:{_id,name,email,followers,following,photo}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
    .catch(err=>{
        console.log(err)
    })
})

module.exports=router