var mongoose = require("mongoose");

var dbsupportplanSchema = new mongoose.Schema({
    name: String,
    keyname: String
});

module.exports = mongoose.model("Dbsupportplan", dbsupportplanSchema);