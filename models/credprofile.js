var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CredprofileSchema = new mongoose.Schema({
    admin: Number,
    user: Number
});

CredprofileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Credprofile", CredprofileSchema);