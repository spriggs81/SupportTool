var mongoose = require("mongoose");

var dbserverSchema = new mongoose.Schema({
    type: String,
    dbtype: String,
    dbversion: String,
    ip: String,
    hostname: String,
    port: Number,
    dbname: String,
    dbschema: String,
    jdbcurl: String,
    notes: String,
    ram: String,
    cpu: String,
    disk: String,
    os: String
});

module.exports = mongoose.model("DBserver", dbserverSchema);