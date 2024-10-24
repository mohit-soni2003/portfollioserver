const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require("jsonwebtoken");
const app = express(); 
const port = 8000;

const Counter = require("./models/count");
const User = require("./models/user");
const Project = require("./models/project");
const achievement = require("./models/achievement");
const eduqualification = require("./models/eduqualification");
const personaldetail = require("./models/personaldetail");
const skills = require("./models/skills");
const sociallink = require("./models/sociallink");
const {jwt_secret } = require("../keys.js");
const requirelogin = require('./middlewares/requirelogin.js');

app.use(cors())
app.use(express.json())     //Middleware to parse JSON bodies

mongoose.connect("mongodb+srv://mohit:Indore123@cluster0.wkqzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connection.on("connected",()=>{
    console.log("Succesfullky Connected To Database......")
})
mongoose.connection.on("error",()=>{
    console.log("Not Connected To Database......")
})


app.get('/', (req, res) => {
    res.send('Server is running!');
  });
app.get('/temp',requirelogin,(req,res)=>{
    res.send("hiii.....")
})
app.post('/registeradmin',requirelogin,(req,res)=>{
    const {name , email , username , password} = req.body;
    if(!name || !email || !password || !username){
        return res.json({error:"Please enter all details"})
    }
    const user = new User({
        name , 
        email,
        username,
        password,
    })

    user.save()
    .then((res)=>{
        console.log(res)
    })
    .catch(err=>console.log(err))
    res.json({message:"signup Successful"})
})
app.post('/adminlogin', (req, res) => {
    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
        return res.json({ error: "Please enter all fields" });
    }

    // Find the user by username
    User.findOne({ username: username })
        .then((saveUser) => {
            if (!saveUser) {
                // User not found
                return res.json({ error: "No user found" });
            }

            // Check if password matches
            if (saveUser.password !== password) {
                return res.json({ error: "Wrong password" });
            }

            // Sign the token (you can pass in only necessary info like user ID)
            const token = jwt.sign({ id: saveUser._id }, jwt_secret);

            // Respond with the token or any success message
            res.cookie("uid",token)
            return res.json({ message: "Login successful", token: token });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: "Server error" });
        });
});



app.get('/count',async(req,res)=>{
    try{    
        let cnt = await Counter.findOne();
        if (!cnt) {
            cnt = new Counter({ count: 1 }); // Initialize with 1 view
          } else {
            cnt.count += 1; // Increment view count
          }
          await cnt.save();
          res.json(cnt);
    }
    catch(error){
        console.log(error)
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.listen(port ,()=>{
console.log("Server is running on port " + port)
})
