var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    admin: Boolean,
    defaultview:Boolean,
    settings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usersettings"
    }
});

UserSchema.methods.generateHash = function(password) {
     return bcrypt.hashSyync(password, bcrypt.genSaltSync(8), null)
};

UserSchema.methods.validPassword = function(password){
     return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
