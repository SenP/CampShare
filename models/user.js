var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


//Define the schema
var UserSchema = new mongoose.Schema({
                                        username: String,
                                        password: String
                                    });
                                    
UserSchema.plugin(passportLocalMongoose);
                                    
//Define the model
module.exports = mongoose.model("User", UserSchema);


