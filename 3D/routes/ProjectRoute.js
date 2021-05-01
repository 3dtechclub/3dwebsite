var express=require("express");
var router=express.Router();
var ProjectBase=require("../models/Project");
var User=require("../models/User");

router.get("/Project",function(req,res){
    ProjectBase.find({},function(err,projects){
        if(err)
        {console.log(err);}
        else
        {res.render("project_index",{projects:projects});}
    });
});
router.get("/Project/:id/",function(req,res){
    ProjectBase.findById(req.params.id,function(err,foundProject){
       
        {res.render("projectdisplay.ejs",{thisProject:foundProject});}
    });
});
router.post("/Project/:id/edit",isLoggedIn,isadmin,function(req,res){
    var members=req.body.members;var expired;
    var images=req.body.images;
    if(req.body.expired==null){
        expired=false;
    }
    else{
        expired=req.body.expired;
    }
    var memberarray=members.split(',');
    var imagearray=images.split(' || ');
    console.log(memberarray);
    ProjectBase.findByIdAndUpdate(req.params.id,
        {name:req.body.name,
        image:req.body.image,
        hone:req.body.hone,
        images:imagearray,
        category:req.body.category,
        description:req.body.description,
        team:memberarray,
        expired:expired,
        contact:req.body.contact},
        {new:true},function(err,result){
            if(err){console.log(err);}
            else{console.log(result);}
        });
    res.redirect('back');
});
router.get("/Project/:id/remove",isLoggedIn,isadmin,function(req,res){
    ProjectBase.findByIdAndDelete(req.params.id,function(err,foundProject){
        if(err)
        {console.log(err);}
        else
        {
            console.log("Successfully Removed");
        }
        res.redirect("/Project");
    });
});
router.get("/ProjectSearch",function(req,res){
    var search=req.query.search;
    ProjectBase.find({$or:[{name:{$regex:search,$options:'i'}},{name:{$regex:search.replace(/\s/g,''),$options:'i'}},{category:{$regex:search,$options:'i'}},{category:{$regex:search.replace(/\s/g,''),$options:'i'}},{description:{$regex:search,$options:'i'}},{description:{$regex:search.replace(/\s/g,''),$options:'i'}}]},function(err,projects){
        if(err)
        {console.log(err);console.log(search);}
        else
        {res.render("project_index",{projects:projects});}
    });
});
router.get("/newProject",isLoggedIn,isadmin,function(req,res){
    res.render("newProject");
});
router.post("/newProject",isLoggedIn,isadmin,function(req,res){
    var members=req.body.members;
    var memberarray=members.split(',');
    var images=req.body.images;
    var imagearray=images.split(' || ');
    console.log(memberarray);
    
    ProjectBase.create(
        {
            name:req.body.name,
            image:req.body.image,
            images:imagearray,
            hone:req.body.hone,
            category:req.body.category,
            description:req.body.description,
            team:memberarray,
            contact:req.body.contact  
        }
    );
    res.redirect("/Project");
});
/*router.post("/Event/:id/edit",isLoggedIn,isadmin,function(req,res){
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
});*/

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