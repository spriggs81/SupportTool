var mongoose = require("mongoose");

var managementSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    role: String,
    keyword: String

});

module.exports = mongoose.model("Management", managementSchema);
