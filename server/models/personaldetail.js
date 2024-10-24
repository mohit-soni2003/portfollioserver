const mongoose = require("mongoose");

const personaldetailSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    phoneno:{
        type:String,
    },
    whatsappno:{
        type: String,
    },
    email:{
        type:String,
    },
})
module.exports = mongoose.model("Personaldetail",personaldetailSchema);