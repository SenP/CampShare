var mongoose = require("mongoose");
var Comment = require("./comment");

//Define the schema
var campgroundSchema = new mongoose.Schema({
                                        name: String,
                                        image: String,
                                        description: String,
                                        author: {
                                                    _id: { 
                                                          type: mongoose.Schema.Types.ObjectId,
                                                          ref: "User"
                                                        },
                                                    username: String
                                                },
                                        comments: [
                                                    {
                                                     type: mongoose.Schema.Types.ObjectId,
                                                     ref: "Comment"
                                                    }
                                                ]
                                    });
                                    
//Define the model
module.exports = mongoose.model("campground", campgroundSchema);