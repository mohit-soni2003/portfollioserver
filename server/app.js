const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const port = 8000;

const Counter = require("./models/count");

app.use(cors())

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
