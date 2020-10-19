const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const CredprofileSchema = new mongoose.Schema({
    admin: Number,
    user: Number
});

CredprofileSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Credprofile", CredprofileSchema);
