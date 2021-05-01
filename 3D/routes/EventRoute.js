var express=require("express");
var router=express.Router();
var EventBase=require("../models/Event");
var User=require("../models/User");
router.get("/",function(req,res){
    res.render("Home.ejs");
});
router.get("/Event",function(req,res){
    EventBase.find({},function(err,events){
        if(err)
        {console.log(err);}
        else
        {res.render("plane.ejs",{events:events});}
    });
});
router.get("/Event/:id/",function(req,res){
    EventBase.findById(req.params.id,function(err,foundEvent){
        if(err)
        {console.log(err);}
        else
        {
            EventBase.find({"category":foundEvent.category,"_id":{$ne:foundEvent._id}},function(err,events){
                if(err)
                {
                    console.log(events);
                }
                else
                {res.render("disp.ejs",{thisEvent:foundEvent,events:events});}
            })
            
        }
    });
});
router.get("/Event/:id/remove",isLoggedIn,isadmin,function(req,res){
    EventBase.findByIdAndDelete(req.params.id,function(err,foundEvent){
        if(err)
        {console.log(err);}
        else
        {
            console.log("Successfully Removed");
        }
        res.redirect("/Event");
    });
});
router.get("/categories/:type",function(req,res){
    EventBase.find({"category":req.params.type},function(err,events){
        if(err)
        {console.log(err);}
        else
        {res.render("plane.ejs",{events:events});}
    });
});
router.get("/EventSearch",function(req,res){
    var search=req.query.search;
    EventBase.find({$or:[{name:{$regex:search,$options:'i'}},{name:{$regex:search.replace(/\s/g,''),$options:'i'}},{category:{$regex:search,$options:'i'}},{category:{$regex:search.replace(/\s/g,''),$options:'i'}},{description:{$regex:search,$options:'i'}},{description:{$regex:search.replace(/\s/g,''),$options:'i'}},{venue:{$regex:search,$options:'i'}},{venue:{$regex:search.replace(/\s/g,''),$options:'i'}}]},function(err,events){
        if(err)
        {console.log(err);console.log(search);}
        else
        {res.render("plane.ejs",{events:events});}
    });
});
router.get("/newEvent",isLoggedIn,isadmin,function(req,res){
    res.render("new.ejs");
});
router.post("/newEvent",isLoggedIn,isadmin,function(req,res){
    EventBase.create({name:req.body.name,image:req.body.image,category:req.body.category,description:req.body.description,edate:req.body.edate,etime:req.body.etime,venue:req.body.venue,reglink:req.body.reglink});
    res.redirect("/Event");
}); 
router.post("/Event/:id/edit",isLoggedIn,isadmin,function(req,res){
    EventBase.findByIdAndUpdate(req.params.id,
        {name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        description:req.body.description,
        edate:req.body.edate,
        etime:req.body.etime,
        venue:req.body.venue,
        reglink:req.body.reglink},
        {new:true},function(err,result){
            if(err){console.log(err);}
            else{console.log(result);}
        });
    res.redirect("/Event/"+req.params.id);
});
router.get("/Event/:id/expired",isLoggedIn,isadmin,function(req,res){
    EventBase.findByIdAndUpdate(req.params.id,
        {expired:true},{new:true},function(err,result){
            if(err){console.log(err);}
            else{console.log(result);}
        });
        res.redirect("/Event/"+req.params.id);
});
router.get("/Event/:id/notExpired",isLoggedIn,isadmin,function(req,res){
    EventBase.findByIdAndUpdate(req.params.id,
        {expired:false},{new:true},function(err,result){
            if(err){console.log(err);}
            else{console.log(result);}
        });
        res.redirect("/Event/"+req.params.id);
});
//AUTH ROUTES

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    {return next();}
    res.redirect("/user/login");
}
function isadmin(req,res,next){
    if(req.user.isAdmin==true)
    {return next();}
    else
    res.redirect("/user/login");
}

module.exports=router;