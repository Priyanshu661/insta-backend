const express=require("express");
const mongoose=require("mongoose")
const app=express()
const PORT=5000 || process.env.PORT
const {MONGOURI}=require("./config/keys")
const cors=require("cors")



mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})

mongoose.connection.on("error",(err)=>{
    console.log("error connecting to mongodb",err)
})

// require models
require("./models/user")
require("./models/post")

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(cors())
  
app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))



if(process.env.NODE_ENV=="production"){
    app.use(express.static("frontend/build"))
    const path=require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","build","index.html"))
    })
}



app.listen(PORT,function(){
    console.log("Server is running on",PORT)
})
