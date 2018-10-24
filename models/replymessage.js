var mongoose = require("mongoose");

var replymessageSchema = new mongoose.Schema({
    creator: {
        id: {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        display: String
    },
    created: {type: Date, default: Date.now},
    comment: String
});

module.exports = mongoose.model("Replymessage", replymessageSchema);