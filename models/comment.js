var mongoose = require("mongoose");

//Define the schema
var commentSchema = new mongoose.Schema({
                                        text: String,
                                        author: {
                                                    _id: { 
                                                          type: mongoose.Schema.Types.ObjectId,
                                                          ref: "User"
                                                        },
                                                    username: String
                                                }
                                        });
                                    
//Define the model
module.exports = mongoose.model("Comment", commentSchema);


