//RETURNS OBJECT WITH MIDDLEWARE FUNCTIONS

var Campground = require("../models/campground"),
       Comment = require("../models/comment");
       
var middlewareObj  = {};

//CHECK IF USER IS LOGGED IN
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}

//CHECK IF USER OWNS THE CAMPGROUND
function isCampOwner(req, res, next) {
    Campground.findById(req.params.id, function(err, foundCampground) {
       if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
                if (foundCampground.author._id.equals(req.user._id)){
                    return next();
                }
                else {
                    req.flash("error", "Only owner can edit or delete!!!");
                    res.redirect("back");
                }
        }
    });
}

//CHECK IF USER OWNS THE COMMENT
function isCommentOwner(req, res, next) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
                if (foundComment.author._id.equals(req.user._id)){
                    return next();
                }
                else {
                    req.flash("error", "Only owner can edit or delete!!!");
                    res.redirect("back");
                }
        }
    });
}

//ASSIGN THE FUNCTIONS TO MIDDLEWARE OBJECT
middlewareObj.isLoggedIn = isLoggedIn;
middlewareObj.isCampOwner = isCampOwner;
middlewareObj.isCommentOwner = isCommentOwner;


module.exports = middlewareObj;