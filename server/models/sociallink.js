const mongoose = require("mongoose");

const sociallinkSchema = new mongoose.Schema({
    instagram:{
        type:String,
    },
    youtube:{
        type:String,
    },
    linkedin:{
        type: String,
    },
    codechef:{
        type:String,
    },
    codeforces:{
        type:String,
    },
    leetcode:{
        type:String,
    },
    gfg:{
        type:String,
    },
    github:{
        type:String,
    },
    website:{
        type:String,
    },
    
})
module.exports = mongoose.model("Sociallonk",sociallinkSchema);

