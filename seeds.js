var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var Lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

var data = [
                {name: "Trees house",
                 image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
                 description: Lorem 
                },
                {name: "Beach View",
                 image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
                 description: Lorem
                },
                {name: "Cloud's Rest",
                 image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
                 description: Lorem
                }
            ];
            
function seedDB(){
    //Remove all campgrounds
    Campground.remove(function(err){
                            if(err) {
                                console.log(err);
                            }
                            else {
                                console.log("All campgrounds removed");
                                //remove all comments
                                Comment.remove().exec();
                                console.log("All comments removed");
                                // Create some new campgrounds
                                Campground.create(data, function(err,result){
                                                            if(err){
                                                                console.log("error");
                                                            }
                                                            else {
                                                                console.log("added new campgrounds!");
                                                                Campground.find({},function(err, campgrounds) {
                                                                                        if(err) {
                                                                                            console.log("error");
                                                                                        }
                                                                                        else {
                                                                                            campgrounds.forEach(function(campground){
                                                                                                        Comment.create({text: "This is the first comment",
                                                                                                                        author: "Senthil"
                                                                                                                        },function(err, comment){
                                                                                                                            campground.comments.push(comment);
                                                                                                                            campground.save();
                                                                                                                            //console.log("Campground Created:");
                                                                                                                            //console.log(campground);
                                                                                                                        });
                                                                                            });
                                                                                        }
                                                                                    }
                                                                                );
                                                            }
                                                        }
                                );
                            }
                    });
}

module.exports = seedDB;