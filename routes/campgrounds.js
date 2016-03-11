var express = require("express"),
    router  = express.Router(),
    MethodOverride  = require("method-override");

router.use(MethodOverride("_method"));

var Campground = require("../models/campground"),
       Comment = require("../models/comment");

var middleware = require("../middleware");
       
// SHOW ALL CAMPGROUNDS
router.get("/", function(req, res){
    Campground.find({}, function(err,allcampgrounds){
        if(err){
            console.log("error");
        }
        else{
            res.render("campgrounds/campgrounds",{campgrounds:allcampgrounds});
        }
    });
});

// SHOW NEW CAMGROUND PAGE
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


// SHOW A CAMPGROUND PAGE
router.get("/:id", function(req, res)
                                    {
                                        Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground)
                                                                                {
                                                                                    if(err){
                                                                                        res.redirect("/campgrounds");
                                                                                    }
                                                                                    else {
                                                                                        res.render("campgrounds/show",{campground:foundCampground});                                            
                                                                                    }
                                                                                }
                                                            );
                                    }
);

// CREATE A NEW CAMPGROUND
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampGround = {name:name, image:image, description:description, author:req.user};
    Campground.create(newCampGround, function(err, campground)
                                            {
                                                if(err) {
                                                    req.flash("error", "Sorry, Something went wrong while adding campground");
                                                    res.redirect("/campgrounds");
                                                }
                                                else {
                                                    req.flash("success", "Campground added successfully!");
                                                    res.redirect("/campgrounds");
                                                }
                                            }
                    );
});

//SHOW EDIT CAMPGROUND
router.get("/:id/edit", middleware.isLoggedIn, middleware.isCampOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground) {
                                                                        if(err){
                                                                                req.flash("error", "Sorry, Something went wrong while editing campground");
                                                                                res.redirect("/campgrounds");
                                                                            }
                                                                        else {
                                                                                res.render("campgrounds/edit",{campground:foundCampground});                                            
                                                                        }
                                                            });
 });

//UPDATE A CAMPGROUND
router.put("/:id", middleware.isLoggedIn, middleware.isCampOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, UpdatedCampground)
                                                                                {
                                                                                    if(err){
                                                                                        req.flash("error", "Sorry, Something went wrong while editing campground");
                                                                                        res.redirect("/campgrounds/" + req.params.id); 
                                                                                    }
                                                                                    else {
                                                                                        req.flash("success", "Campground updated successfully!");
                                                                                        res.redirect("/campgrounds/" + req.params.id);                                            
                                                                                    }
                                                                                }
                                                            );
});

//DELETE A CAMPGROUND
router.delete("/:id", middleware.isLoggedIn, middleware.isCampOwner, function(req, res){
    
    Campground.findById(req.params.id, function(err, foundCampground) {
                                                if(err){
                                                        req.flash("error", "Sorry, Something went wrong while deleting campground");
                                                        res.redirect("/campgrounds/" + req.params.id);
                                                }
                                                else {  //Remove related comments
                                                        Comment.remove( { 
                                                                            _id: { $in: foundCampground.comments } 
                                                                        }, function(err, result) {
                                                                                if(err){
                                                                                        req.flash("error", "Sorry, Something went wrong while deleting campground");
                                                                                        res.redirect("/campgrounds/" + req.params.id);
                                                                                }
                                                                            }
                                                        );  
                                                        //Remove the campground
                                                        foundCampground.remove(function(err, deletedCampground) {
                                                                        if(err){
                                                                                req.flash("error", "Sorry, Something went wrong while deleting campground");
                                                                                res.redirect("/campgrounds/" + req.params.id);
                                                                        }
                                                                        else {
                                                                              req.flash("success", "Campground deleted successfully!");
                                                                              res.redirect("/campgrounds");
                                                                        }
                                                        });
                                                 }
    });
});
        

module.exports = router;