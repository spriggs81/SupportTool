const mongoose = require("mongoose");

const usersettingsSchema = new mongoose.Schema({
     settingid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
              },
    urlpic: String,
    department: String,
    title: String,
    manager: String,
    lead: String,
    timedifference: String

});

module.exports = mongoose.model("Usersettings", usersettingsSchema);
