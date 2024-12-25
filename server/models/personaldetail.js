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
    photo1:{
        type:String,
    },
    photo2:{
        type:String,
    }
})
module.exports = mongoose.model("Personaldetail",personaldetailSchema);