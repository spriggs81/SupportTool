const mongoose = require("mongoose");

const dbclientstatusSchema = new mongoose.Schema({
    name: String,
    keyname: String,
});

module.exports = mongoose.model("Dbclientstatus", dbclientstatusSchema);
