const mongoose = require("mongoose");

const dbproductSchema = new mongoose.Schema({
    name: String,
    keyname: String,
    info:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mainmessage"
    }]
});

module.exports = mongoose.model("Dbproduct", dbproductSchema);
