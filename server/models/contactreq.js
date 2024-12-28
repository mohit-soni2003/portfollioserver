const mongoose = require("mongoose");

const contactreqSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    phoneno:{
        type:String,
    },
    email:{
        type:String,
    },
    subject:{
        type:String,
    },
    description:{
        type:String,
    },
    date: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    }
})
module.exports = mongoose.model("Contactreq",contactreqSchema);