var express = require("express"),
    router  = express.Router({mergeParams:true});

var mongoose        = require("mongoose");

var Campground = require("../models/campground"),
       Comment = require("../models/comment");

var middleware = require("../middleware");

// SHOW NEW COMMENT PAGE
router.get("/new", middleware.isLoggedIn, function(req, res){
    //Find campground by ID
    Campground.findById(req.params.id, function(err, campground){
                                        if(err) {
                                            console.log("Error");
                                        }
                                        else {
                                           res.render("comments/new",{campground:campground});    
                                        }
    });
});

// CREATE A NEW COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    //Find the campground object
    Campground.findById(req.params.id, function(err,foundCampground){
                                        if(err){
                                            console.log(err);
                                        }
                                        else {
                                            //Create a new comment object
                                            Comment.create({
                                                            text:   req.body.comment, 
                                                            author: req.user 
                                                            }, function(err, newcomment){
                                                if(err){
                                                        req.flash("error", "Sorry, Something went wrong while adding comment");
                                                        res.redirect("/campgrounds/" + foundCampground._id);                                               
                                                        }
                                                else {
                                                    foundCampground.comments.push(newcomment);
                                                    foundCampground.save();
                                                    req.flash("success", "Comment added successfully!");
                                                    res.redirect("/campgrounds/" + foundCampground._id);
                                                }
                                            });
                                        }
                        });
});

// SHOW EDIT COMMENT PAGE
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.isCommentOwner, function(req, res){
    
    //Find comment by ID
    Comment.findById(req.params.comment_id, function(err, foundComment){
                                        if(err) {
                                            console.log("Error");
                                        }
                                        else {
                                          res.render("comments/edit",{campground_id:req.params.id, comment:foundComment});    
                                        }
    });
});

// UPDATE A COMMENT
router.put("/:comment_id", middleware.isLoggedIn, middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, UpdatedComment)
                                                                                {
                                                                                    if(err){
                                                                                        req.flash("error", "Sorry, Something went wrong while updating comment");
                                                                                        res.redirect("/campgrounds/" + req.params.id); 
                                                                                    }
                                                                                    else {
                                                                                        req.flash("success", "Successfully updated comment");
                                                                                        res.redirect("/campgrounds/" + req.params.id);                                            
                                                                                    }
                                                                                }
                                                            );
    
});    

//DELETE A COMMENT
router.delete("/:comment_id", middleware.isLoggedIn, middleware.isCommentOwner, function(req, res){

  Comment.findByIdAndRemove(req.params.comment_id, function(err, deletedComment) {
                                                                                if(err){
                                                                                        req.flash("error", "Sorry, Something went wrong while deleting comment");
                                                                                        res.redirect("/campgrounds/" + req.params.id);
                                                                                }
                                                                                else {
                                                                                        Campground.findByIdAndUpdate(req.params.id, 
                                                                                                                     { 
                                                                                                                         $pull: { 
                                                                                                                             comments: req.params.comment_id  
                                                                                                                           }     
                                                                                                                    }, function (err,data) {
                                                                                                                        if(err) {
                                                                                                                                req.flash("error", "Sorry, Something went wrong while deleting comment");
                                                                                                                                res.redirect("/campgrounds/" + req.params.id);
                                                                                                                        }
                                                                                                                        else {
                                                                                                                            req.flash("success", "Successfully Deleted comment");
                                                                                                                            res.redirect("/campgrounds/" + req.params.id);
                                                                                                                        }
                                                                                        });
                                                                                }
    });
});
 

module.exports = router;