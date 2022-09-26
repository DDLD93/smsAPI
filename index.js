const express = require("express")
const cors = require("cors")
const { totp } = require('node-otp')
require("./db")()
const User = require("./model")
const path = require('path');


totp({
  secret: '12345678901234567890',
})
const app = express()
app.use(cors())
app.use(express.json({limit: '50mb'}))

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const credentials = {
    apiKey: 'df331b17b5e41293af966010887a36a3253ed6b4ea067b653834a59f0092080e',
    username: 'ujere',
}

// Initialize the SDK
const AfricasTalking = require('africastalking')(credentials);

// Get the SMS service
const sms = AfricasTalking.SMS;



function sendMessage(phone,code) {
    const options = {
        // Set the numbers you want to send to in international format
        to: [phone],
        // Set your message
        message: `welcome NDEU portal... Your code is ${code}`,
        // Set your shortCode or senderId
        from: '+2347055793353'
    }
    console.log(options)

    // That’s it, hit send and we’ll take care of the rest
    sms.send(options)
        .then(console.log)
        .catch(console.log);
}


app.post("/check", async (req,res)=>{
    let {phone}=req.body
    try {
        let user = await User.findOne({phone})
        let newPhone = "+234"+phone
        
        if(user){
            res.send({message:"password"}) 
        }else{
            let code = totp({
                secret: phone,
                time:8000
              })
              sendMessage(newPhone,code)
    
              res.send({code,message:"code"}) 
        }
       
    } catch (error) {
        res.send({error})    
}})

app.post("/verify",async (req,res)=>{
    let {phone,token}=req.body
    let code = totp({
        secret: phone,
        time:8000
    })
    

    if(code==token){
        res.send({message:"register"}) 
    }else{
        res.send({message:"register"}) 
    }
})
app.post("/login",async (req,res)=>{
    let {phone,password}=req.body
    let user = await User.find({phone})

    
    if(user.password==password){
        res.send({message:"login good"}) 
    }
      res.send({code,message:"login bad"})
})
app.post("/register",async (req,res)=>{
    let data=req.body
    let newUser = new Batch(data);
    let user = await newUser.save();

    
    if(user){
        res.send({message:"login good"}) 
    }
      res.send({code,message:"login bad"})
})

app.listen(7000,()=>console.log("server started"))