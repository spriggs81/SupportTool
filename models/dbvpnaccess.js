const mongoose = require("mongoose");

const dbvpnaccessSchema = new mongoose.Schema({
    name: String,
    keyname: String
});

module.exports = mongoose.model("Dbvpnaccess", dbvpnaccessSchema);
