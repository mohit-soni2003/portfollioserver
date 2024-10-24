const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    Organised_by:{
        type:String,
    },
    mode:{
        type: String,
    },
    desc:{
        type:String,
    },
    image:{
        type:String
    }
})
module.exports = mongoose.model("Achievement",achievementSchema);