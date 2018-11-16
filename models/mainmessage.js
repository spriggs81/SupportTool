var mongoose = require("mongoose");

var mainmessageSchema = new mongoose.Schema({
    product: String,
    type: String,
    creator: {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        _id: String,
        firstname: String,
        lastname: String
    },
    created: {type: Date, default: Date.now},
    desc: String,
    message: String,
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Replymessage"
    }]
});

module.exports = mongoose.model("Mainmessage", mainmessageSchema);