const mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    price:String
    
});
const Comment = require("./comment")
campgroundSchema.pre('remove',async()=>{
    await Comment.deleteMany({_id:{
        $in:this.comments
    }});
});
module.exports = mongoose.model("Campground",campgroundSchema);