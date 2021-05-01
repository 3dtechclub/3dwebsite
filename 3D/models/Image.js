var mongoose=require("mongoose");
var albumSchema=new mongoose.Schema({
    name:String,
    images:[String],
    count:Number,
    dateCreated:Date
});
module.exports=mongoose.model("Image",albumSchema);