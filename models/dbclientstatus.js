var mongoose = require("mongoose");

var dbclientstatusSchema = new mongoose.Schema({
    name: String,
    keyname: String,
});

module.exports = mongoose.model("Dbclientstatus", dbclientstatusSchema);