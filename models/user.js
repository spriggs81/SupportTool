const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    admin: Boolean,
    defaultview:Boolean,
    startDate: Date,
    settings: {
      urlpic: String,
      department: String,
      title: String,
      manager: String,
      lead: String,
      timedifference: String
    }
});

UserSchema.methods.generateHash = (password) => {
     return bcrypt.hashSyync(password, bcrypt.genSaltSync(8), null)
};

UserSchema.methods.validPassword = (password) => {
     return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
