var express=require("express");
var app=express();
var router=express.Router();
var User=require("../models/User");
var passport=require("passport");
var async = require("async");
var flash=require('express-flash');
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var LocalStrategy=require("passport-local");
//AUTH ROUTES
router.get("/user/register", function(req, res){
    res.render("register.ejs",{page:'register'});
});
app.use(flash());
// handle sign up logic
router.post("/user/register", function(req, res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      });
      if(req.body.adminCode === 'aobcd8663') {
      newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register.ejs", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           //req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect('/'); 
        });
    });
});
//show login form
router.get("/user/login", function(req, res){
    res.render("login.ejs", {page:'login'}); 
 });
// handling login logic
router.post("/user/login", passport.authenticate("local",
    {
        successRedirect: '/',
        failureRedirect: "back",
        failureFlash:"Incorrect"
}));
// logout route
router.get("/user/logout", function(req, res){
   req.logout();
   res.redirect('back');
});
// forgot password
router.get('/user/forgot', function(req, res) {
    res.render('forgot.ejs');
  });
  
  router.post('/user/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            //req.flash('error', 'No account with that email address exists.');
            return res.redirect('/user/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          host:"smtp.gmail.com",
          auth: {
            type: 'login',

            user: '3dtechclub.nitrkl@gmail.com',
            pass: 'AOBCD8663',
            

          }
        });
        var mailOptions = {
          to: user.email,
          from: '3dtechclub.nitrkl@gmail.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/user/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset.ejs', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
//            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
             // req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'learntocodeinfo@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'learntocodeinfo@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          //req.flash('Success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
  
  // USER PROFILE
  router.get("/user/edit", function(req, res) {
    User.findByIdAndUpdate(req.params.id, 
      {
        
      }
      );
  });
  
router.get('/user/deregister', isLoggedIn, function(req, res,){
    User.findByIdAndDelete(req.user.id,function(err,foundUser){
        if(err){console.log(err);}
        else{
            console.log("SUCCESS");
        }
    });
    req.logout();
    res.redirect("/");
  });
    router.get('user/deregister/:id', isLoggedIn,isadmin, function(req, res,){
      User.findByIdAndDelete(req.params.id,function(err,foundUser){
          if(err){console.log(err);}
          else{
              console.log("SUCCESS");
          }
      });
      
      return res.redirect('back');
    
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
