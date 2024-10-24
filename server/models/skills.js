const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    skillname:{
        type:String,
    },
    percentage:{
        type:Number,
    }
})
module.exports = mongoose.model("Skill",skillSchema);