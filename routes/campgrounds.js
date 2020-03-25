var express = require("express")
var router  = express.Router()
var Campground = require('../models/campground');
var middleware = require("../middleware")//automatically includes the content of index.js

//index
router.get("/",(req,res)=>{
    Campground.find({},(err,allCamps)=>{
        if(err){
            return console.log(err);
        }
        res.render("campgrounds/index",{camps:allCamps});
    })
})
//new
router.get("/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new")
})
//create
router.post("/",middleware.isLoggedIn,(req,res)=>{
    Campground.create(req.body.campground,(err,createdCamp)=>{
        if(err){
            return console.log(err)
        }
        createdCamp.author.id =  req.user._id;
        createdCamp.author.username = req.user.username;
        createdCamp.save();
        console.log(createdCamp);
        res.redirect("/campgrounds")
    })
})
//show
router.get("/:id",(req,res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err,foundCamp)=>{
        if(err){
            return console.log(err);
        }
        console.log(foundCamp);
        res.render("campgrounds/show",{camp:foundCamp})
    })})
//edit
router.get("/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
        Campground.findById(req.params.id,(err,foundCamp)=>{
            res.render("./campgrounds/edit",{camp:foundCamp})
        })
})
//update
router.put("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,(err)=>{
            res.redirect("/campgrounds/" + req.params.id);
    })
})
//delete
router.delete("/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err){
            return console.log(err);
        }
        res.redirect("/campgrounds");
    })
})

module.exports = router;