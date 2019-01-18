var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
    name: String,
    supportPlan: String,
    status: String,
    timezone: String,
    ccm: String,
    configLead: String,
    installLead: String,
    licenseType: String,
    vpnAccess: String,
    rdpAccess: String,
    requestMethod: String,
    properties: Number,
    it_24_7: String,
    clientit:String,
    connection: String,
    adclient: String,
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    appservers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appserver"
    }],
    dbservers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DBserver"
    }]
    
});

module.exports = mongoose.model("Client", clientSchema);