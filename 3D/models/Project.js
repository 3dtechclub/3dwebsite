var mongoose=require("mongoose");
var projectSchema=new mongoose.Schema({
    name:String,
    image:String,
    images:[String],
    expired: {type:Boolean,default:false},
    category:String,    
    description:String,
    hone:String,
    team:[String],
    contact:String
});
module.exports=mongoose.model("Project",projectSchema);