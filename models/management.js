const mongoose = require("mongoose");

const managementSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    role: String,
    keyword: String

});

module.exports = mongoose.model("Management", managementSchema);
