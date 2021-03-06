var express         = require('express'),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    MethodOverride  = require("method-override"),
    LocalStrategy   = require("passport-local").Strategy;

var Campground = require("./models/campground"),
       Comment = require("./models/comment"),
          User = require("./models/user"),
        seedDB = require("./seeds.js");

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    authRoutes       = require("./routes/index");
    
var Database = process.env.DBURL || "mongodb://localhost/yelp_camp";

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(Database);

app.use(express.static(__dirname + "/public"));
app.use(MethodOverride("_method"));
app.use(flash());

//seedDB();

//Configure passport
app.use(require("express-session")({
    secret: "This is getting REALLY interesting!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
   console.log("CampShare server started listening"); // at", addr.address + ":" + addr.port);
});
