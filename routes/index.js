var express = require("express"),
    router  = express.Router();

var  User    = require("../models/user");
var passport = require("passport");

// HOME PAGE
router.get("/", function(req, res){
    res.render("landing");
});


//=========================
// AUTH ROUTES
//=========================

//Show Signup Page
router.get("/register", function(req,res){
    res.render("register");
});

//Handle signup logic
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
                                                if(err) {
                                                    req.flash("error", err.message);
                                                    return res.redirect("/register");
                                                }
                                                //Login and redirect 
                                                req.login(user, function(err){
                                                    
                                                    if(err) { req.flash("error", err.message); 
                                                              return res.redirect("/register"); }
                                                    
                                                    req.flash("success", "Welcome to CampShare " + user.username + " !");
                                                    res.redirect("/campgrounds");
                                                });
                });
});

//Show Login Page
router.get("/login", function(req,res){
    res.render("login");
});

//Handle Login requests
router.post('/login', function(req, res, next) {
  
                                          passport.authenticate('local', function(err, user, info) {
                                                                                        if (err) { return next(err); }
                                                                                        
                                                                                        if (!user) { 
                                                                                                    req.flash("error", info.message);
                                                                                                    return res.redirect('/login'); 
                                                                                                    }
                                                                                        req.logIn(user, function(err) {
                                                                                                        if (err) { return next(err); }
                                                                                                        req.flash("success", "Welcome to CampShare " + user.username + " !");
                                                                                                        return res.redirect("/campgrounds");
                                                                                        });
                                          })(req, res, next);
});                                       
                                        
 
//Logout
router.get("/logout", function(req, res) {
    req.logout();
     req.flash("success","Logged out..Bye!!!");
    res.redirect("/campgrounds");
});



module.exports = router;