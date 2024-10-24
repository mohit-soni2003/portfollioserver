const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    description:{
        type:String,
    },
    techstack:{
        type: String,
    },
    image:{
        type:String,
    },
})
module.exports = mongoose.model("Project",projectSchema);