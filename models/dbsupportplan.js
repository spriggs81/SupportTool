const mongoose = require("mongoose");

const dbsupportplanSchema = new mongoose.Schema({
    name: String,
    keyname: String
});

module.exports = mongoose.model("Dbsupportplan", dbsupportplanSchema);
