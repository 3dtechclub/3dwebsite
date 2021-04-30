var express     = require("express"),
    
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    
    LocalStrategy = require("passport-local"),
    
    User        = require("./models/User"),
    ImageRoute  =require("./routes/ImageRoute")
    EventRoute    =require("./routes/EventRoute"),
    UserRoute   =require("./routes/UserRoute"),
    BlogRoute  =require("./routes/BlogRoute"),
    ContactUsRoute=require("./routes/ContactUsRoute"),
    ProjectRoute=require("./routes/ProjectRoute"),
    MemberRoute=require("./routes/MemberRoute"),
    express.static(path.join(__dirname, '/3D'));
    session = require("express-session"),
    flash=require('express-flash'),
    methodOverride = require("method-override");
var path=require('path');
var app=express();
require('dotenv').config();

const uri="mongodb+srv://3Duser:UbTtopxGBaX6ueLn@cluster3d.loitc.mongodb.net/3Dtech?retryWrites=true&w=majority"
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch(err => console.log(err))
    
//mongoose.connect("mongodb://localhost/3Dimension",{useCreateIndex:true,useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'views')));

//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database
// PASSPORT CONFIGURATION
/*app.configure(function() {
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());
  });*/
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   //res.locals.success = req.flash('success');
   //res.locals.error = req.flash('error');
   next();
});


//EventBase.create({name:"Harley Davidson", image: "https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"movies"});
//EventBase.create({name:"John Fowler", image: "https://images.unsplash.com/photo-1560382797-66b2d275cb56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"TV Series"});
//EventBase.create({name:"Books", image:"https://images.unsplash.com/photo-1560406146-78f8cb5e0fbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"General Template"});
//EventBase.create({name:"Payment method", image:"https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"General Template"});
//EventBase.create({name:"My Car", image:"https://images.unsplash.com/photo-1560392711-cc5ffe0ea057?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"Movies" });
//EventBase.create({name:"Dream Home", image: "https://images.unsplash.com/photo-1560406145-f34b88bff872?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"TV Series"});
//EventBase.create({name:"Subway", image: "https://images.unsplash.com/photo-1560410779-a931d1981ba8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"General Template"});
//EventBase.create({name:"Desert", image:"https://images.unsplash.com/photo-1560336767-7447ab89afb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"TV Series"});
//EventBase.create({name:"Empire State Building", image:"https://images.unsplash.com/photo-1560268765-84c5eb82fe8a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"Movies"});
//EventBase.create({name:"Mountaineering", image:"https://images.unsplash.com/photo-1560345573-9f453083c335?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"General Template"});
//EventBase.create({name:"Veronica", image:"https://images.unsplash.com/photo-1560384585-1769da827390?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"TV Series"});
//EventBase.create({name:"Shining in the sailing sun", image:"https://images.unsplash.com/photo-1560389667-de69f0a9ead4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",category:"Movies"});

app.use(EventRoute);
app.use(ImageRoute);
app.use(UserRoute);
app.use(BlogRoute);
app.use(ContactUsRoute);
app.use(MemberRoute);
app.use(ProjectRoute);



app.listen(2000,function(){
    console.log("Server active at port 2000");
});
//app.listen(process.env.PORT, process.env.IP, function(){
//   console.log("The 3D Server Has Started!");
//});


