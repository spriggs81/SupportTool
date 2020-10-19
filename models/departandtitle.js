const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
    title: String,
    department: String
});

module.exports = mongoose.model("Department", departmentSchema);
