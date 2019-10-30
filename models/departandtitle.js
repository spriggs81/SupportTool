var mongoose = require("mongoose");

var departmentSchema = new mongoose.Schema({
    title: String,
    department: String
});

module.exports = mongoose.model("Department", departmentSchema);
