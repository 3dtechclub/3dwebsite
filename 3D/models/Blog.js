var mongoose=require("mongoose");
var blogSchema=new mongoose.Schema({
    name:String,
    image:String,
    intro:String,
    author:String,
    category:String,
    fileurl:String,
    dateCreated:Date
});
module.exports=mongoose.model("Blog",blogSchema);