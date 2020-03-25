var express = require("express")
var router  = express.Router()
var User    = require("../models/user")
var passport = require("passport")
//AUTH ROUTES

router.get("/register",(req,res)=>{
    res.render("register");
})
//signup logic
router.post("/register",(req,res)=>{
    var newUser = new User({
        username:req.body.username
    })
    User.register(newUser,req.body.password,(err,newUser)=>{
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome To YelpCamp "+ User.newUser.username);
            res.redirect("/campgrounds")
        })
    })
})
//login routes
//show form
router.get("/login",(req,res)=>{
    res.render("login");
})
//handling login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/register"
}),(req,res)=>{
})
//logout route
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged You Out!!")
    res.redirect("/campgrounds");
})


module.exports = router