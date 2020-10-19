const mongoose = require("mongoose");

const appserverSchema = new mongoose.Schema({
    type: String,
    role: String,
    rdpip: String,
    rdphostname: String,
    rdpdomain: String,
    ram: String,
    cpu: String,
    disk: String,
    os: String,
    apppath: String,
    notes: String
});

module.exports = mongoose.model("Appserver", appserverSchema);
