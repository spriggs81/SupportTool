var mongoose = require("mongoose");

var dbvpnaccessSchema = new mongoose.Schema({
    name: String,
    keyname: String
});

module.exports = mongoose.model("Dbvpnaccess", dbvpnaccessSchema);