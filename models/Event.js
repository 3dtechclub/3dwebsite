var mongoose=require("mongoose");
var eventSchema=new mongoose.Schema({
    name:String,
    image:String,
    expired: {type:Boolean,default:false},
    category:String,    
    description:String,
    edate:Date,
    etime:String,
    venue:String,
    reglink: {type:String,default:"javascript: void(0)"}
});
module.exports=mongoose.model("Event",eventSchema);