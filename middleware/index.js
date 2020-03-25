//all the middleware
var Campground = require("../models/campground")
var Comment = require("../models/comment")
var middlewareObj={}
middlewareObj.checkCampgroundOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,(err,foundCamp)=>{
            if(err){
                req.flash("error","Campground Not Found")
                return res.redirect("back");
            }
            if(foundCamp.author.id.equals(req.user._id)){//=== because req.user.id is string and foundcamp one is object
            next();
            }
            else{
                req.flash("error","You do not have permission to do that")
                res.redirect("back");
            }
        })
    }else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back")
    }
}
middlewareObj.checkCommentOwnership = (req, res, next)=>{
    if(req.isAuthenticated()){
        Comment.findById(req.params.cid,(err,foundComment)=>{
            if(err){
                return res.redirect("back");
            }
            if(foundComment.author.id.equals(req.user._id)){//.equals must be used
            next();
            }
            else{
                req.flash("error","You do not have permission to do that")
                res.redirect("back");
            }
        })
    }else{
        req.flash("error","You need to be logged in to do that")
        res.redirect("back")
    }
}
middlewareObj.isLoggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that")
    res.redirect("/login");
}
module.exports = middlewareObj