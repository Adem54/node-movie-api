const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const {String}=Schema.Types

const movieSchema=new Schema({
    name:String,
    surname:String,
    bio:String,
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongoose.model("directors",movieSchema);
