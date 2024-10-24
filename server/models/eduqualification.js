const mongoose = require("mongoose");

const eduqualificationSchema = new mongoose.Schema({
    year:{
        type:String,
    },
    institute_name:{
        type:String,
    },
    qualification_name:{
        type: String,
    },
    score:{
        type:String,
    },
})
module.exports = mongoose.model("EduqualificationSchema",eduqualificationSchema);