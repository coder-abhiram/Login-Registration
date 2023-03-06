import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app=express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/LoginRegisterDB",{
    useNewUrlParser: true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connected to database");
}).catch((e)=>{
    console.log(e);
})

const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User=new mongoose.model("User",userSchema)
app.post("/login",(req,res)=>{
    const {email,password}=req.body
    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password===user.password)
            {
                res.send(user)

            } else{
                res.send("Password didn't match")
            }
        } else{
            res.send("User not registered")
        }
    })
})

app.post("/register",(req,res)=>{
    const {name,email,password}=req.body
    User.findOne({email:email}).then((user)=>{
        if(user)
        {
            res.send({message: "User already registered"})
        }else
        {
            const user=new User({
                name,
                email,
                password
            })
            user.save().then((err)=>{
                if(err)
                {
                    res.send(err);
                }
                else
                {
                    res.send({message: "Successfully Registered"})
                }
           
            })
        }
    })
})
       
        
     
app.listen(8000,()=>{
    console.log("BE started at port 8000")
}
)