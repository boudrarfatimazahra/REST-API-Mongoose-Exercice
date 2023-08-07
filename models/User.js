const { Schema, model } = require("mongoose");


const userSchema = new Schema ({
    name :{
        type:String,
        required :true, 
    },
    age :{
        type:String,
    },
    email:{
        type:String,
        required:true
    }
})

module.exports= model("user", userSchema)