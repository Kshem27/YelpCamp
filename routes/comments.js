var express = require("express")
var router  = express.Router({mergeParams:true})
var Campground = require('../models/campground'),
    Comment    = require("../models/comment"),
    middleware = require("../middleware");
//new
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            return console.log(err);
        }
        res.render("comments/new",{camp:foundCamp})
    })
})
//post
router.post("/",middleware.isLoggedIn,(req,res)=>{
    //lookup campground
    //create comment
    //connect
    Campground.findById(req.params.id,(err,foundCamp)=>{
        if(err){
            return console.log(err);
        }
        Comment.create(req.body.comment,(err,createdComment)=>{
            if(err){
                req.flash("error","Something Went Wrong!!")
                return console.log(err);
            }
            createdComment.author.id = req.user._id;
            createdComment.author.username = req.user.username;
            createdComment.save();
            foundCamp.comments.push(createdComment);
            foundCamp.save();
            req.flash("success","Successfully Added Comment");
            res.redirect("/campgrounds/"+ req.params.id)
        })
    })
})

//edit
router.get("/:cid/edit",middleware.checkCommentOwnership,(req,res)=>{
    //find campground
    //find comment
        Comment.findById(req.params.cid,(err,foundComment)=>{
            if(err){
                return console.log(err)
            }
            res.render("comments/edit",{camp_id:req.params.id,comment:foundComment});
        })
})
//update
router.put("/:cid",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findByIdAndUpdate(req.params.cid,req.body.comment,(err,updatedComment)=>{
        if(err){
            return console.log(err);
        }
        console.log(updatedComment);
        res.redirect("/campgrounds/"+req.params.id)
    })
})
//delete
router.delete("/:cid",(req,res)=>{
    Comment.findByIdAndDelete(req.params.cid,(err)=>{
        if(err){
            return console.log(err)
        }
        req.flash("success","Comment Deleted");
        res.redirect("/campgrounds/"+req.params.id)
    })
})

module.exports = router