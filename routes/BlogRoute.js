var express=require("express");
var router=express.Router();

var BlogBase=require("../models/Blog");


router.get("/Blogs",function(req,res){
    BlogBase.find({},function(err,blogs){
        if(err)
        {console.log(err);}
        else
        {res.render("blog_index",{blogs:blogs});}
    });
});

router.get("/newBlog",isLoggedIn,isadmin,function(req,res){
    res.render("newBlog");
});
router.post("/newBlog",isLoggedIn,isadmin,function(req,res){
    BlogBase.create(
        {
            name:req.body.blogname,
            image:req.body.blogimage,
            dateCreated:req.body.blogdate,
            intro:req.body.blogintro,
            category:req.body.blogcategory,
            author:req.body.blogauthor,
            fileurl:req.body.blogfile
        }   
    );
    res.redirect("/Blogs");
});
router.get("/BlogSearch",function(req,res){
    var search=req.query.search;
    BlogBase.find({$or:[{name:{$regex:search,$options:'i'}},{name:{$regex:search.replace(/\s/g,''),$options:'i'}},{category:{$regex:search,$options:'i'}},{category:{$regex:search.replace(/\s/g,''),$options:'i'}},{intro:{$regex:search,$options:'i'}},{intro:{$regex:search.replace(/\s/g,''),$options:'i'}},{author:{$regex:search,$options:'i'}},{author:{$regex:search.replace(/\s/g,''),$options:'i'}}]},function(err,blogs){
        if(err)
        {console.log(err);console.log(search);}
        else
        {res.render("blog_index",{blogs:blogs});}
    });
});
router.get("/Blogs/delete/:id",isLoggedIn,isadmin,function(req,res){
    BlogBase.findByIdAndRemove(req.params.id,function(err,foundBlog){
        if(err){console.log(err);}
        else{console.log(foundBlog);}
    });
    res.redirect("/Blogs");
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