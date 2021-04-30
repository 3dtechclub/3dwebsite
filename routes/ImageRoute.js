var express=require("express");
var router=express.Router();

var AlbumBase=require("../models/Image");


router.get("/Gallery",function(req,res){
    AlbumBase.find({},function(err,albums){
        if(err)
        {console.log(err);}
        else
        {res.render("photos",{albums:albums});}
    });
});
router.get("/AlbumSearch",function(req,res){
    var search=req.query.search;
    AlbumBase.find({$or:[{name:{$regex:search,$options:'i'}},{name:{$regex:search.replace(/\s/g,''),$options:'i'}}]},function(err,albums){
        if(err)
        {console.log(err);console.log(search);}
        else
        {res.render("photos",{albums:albums});}
    });
});
router.get("/Gallery/:id",function(req,res){
    AlbumBase.findById(req.params.id,function(err,foundAlbum){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("single",{foundAlbum:foundAlbum});
        }
    });
});

router.post("/newAlbum",isLoggedIn,isadmin,function(req,res){
    var links=req.body.links;
    var newdate=new Date();
    var imagearray=links.split(',');
    console.log(imagearray);
    
    AlbumBase.create(
        {
            name:req.body.albumname,
            dateCreated:newdate,
            images:imagearray,
            count:imagearray.length
        }
    );
    res.redirect("/Gallery");
});
router.get("/Gallery/:id/delete",isLoggedIn,isadmin,function(req,res){
    AlbumBase.findByIdAndRemove(req.params.id,function(err,foundAlbum){
        if(err){console.log(err);}
        else{console.log(foundAlbum);}
    });
    res.redirect("/Gallery");
});

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