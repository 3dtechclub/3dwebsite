var express=require("express");
var router=express.Router();

router.get("/Teams",function(req,res){
    res.render("Teams.ejs");
});
module.exports=router;