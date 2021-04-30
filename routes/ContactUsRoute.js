var express=require("express");
var router=express.Router();
var nodemailer = require("nodemailer");


router.get("/ContactUs",function(req,res){
    res.render("contact");
});

router.post("/ContactUs",function(req,res){

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        host:'smtp.gmail.com',
        auth: {
            type: 'login',
        user: '3dtechclub.nitrkl@gmail.com',
        pass: 'AOBCD8663'
        }
    });
    var sub= 'Contact Us Query From '+req.body.fname+' '+req.body.lname
    var mailOptions = {
        from: '3dtechclub.nitrkl@gmail.com',
        to: '3dclub.nitrkl@gmail.com',
        subject: sub,
        text: 'Subject:'+req.body.subject+'\nMessage:'+req.body.message+'\n\nReply '+req.body.email
        };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    res.redirect('/');
});

module.exports=router;
